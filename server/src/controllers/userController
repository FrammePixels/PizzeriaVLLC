const { dbQuery } = require("../config/database");
const bcrypt = require("bcrypt");
const path = require("path");
const fs = require("fs");

// =============================
// 🎯 MIDDLEWARE DE ADMIN
// =============================
const requireAdmin = (req, res, next) => {
  if (req.user.rol !== "admin") {
    return res.status(403).json({
      success: false,
      error: "Se requieren permisos de administrador"
    });
  }
  next();
};

// =============================
// 👤 PERFIL DE USUARIO
// =============================

// Obtener perfil del usuario actual
const getProfile = async (req, res) => {
  try {
    const [user] = await dbQuery(
      `SELECT Id, NickUsuarios, EmailUsuarios, RolUsuarios, ImagenPerfil, 
              created_at, updated_at 
       FROM usuarios 
       WHERE Id = ?`,
      [req.user.id]
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "Usuario no encontrado"
      });
    }

    res.json({
      success: true,
      data: {
        id: user.Id,
        nick: user.NickUsuarios,
        email: user.EmailUsuarios,
        rol: user.RolUsuarios,
        imagenPerfil: user.ImagenPerfil ? `/uploads/${user.ImagenPerfil}` : null,
        fechaCreacion: user.created_at,
        fechaActualizacion: user.updated_at
      }
    });
  } catch (error) {
    console.error("[GET PROFILE] Error:", error);
    res.status(500).json({
      success: false,
      error: "Error al obtener el perfil"
    });
  }
};

// Actualizar perfil de usuario
const updateProfile = async (req, res) => {
  try {
    const { nickname, email } = req.body;
    const userId = req.user.id;

    // Validaciones
    if (!nickname || !email) {
      return res.status(400).json({
        success: false,
        error: "Nickname y email son obligatorios"
      });
    }

    // Verificar que el email o nickname no estén en uso por otros usuarios
    const existingUser = await dbQuery(
      `SELECT Id FROM usuarios 
       WHERE (LOWER(EmailUsuarios) = LOWER(?) OR LOWER(NickUsuarios) = LOWER(?)) 
       AND Id != ?`,
      [email, nickname, userId]
    );

    if (existingUser.length > 0) {
      return res.status(400).json({
        success: false,
        error: "El email o nickname ya están en uso"
      });
    }

    // Actualizar usuario
    await dbQuery(
      `UPDATE usuarios 
       SET NickUsuarios = ?, EmailUsuarios = ?, updated_at = NOW() 
       WHERE Id = ?`,
      [nickname.trim(), email.trim(), userId]
    );

    res.json({
      success: true,
      message: "Perfil actualizado correctamente",
      data: {
        id: userId,
        nick: nickname,
        email: email
      }
    });
  } catch (error) {
    console.error("[UPDATE PROFILE] Error:", error);
    res.status(500).json({
      success: false,
      error: "Error al actualizar el perfil"
    });
  }
};

// Subir imagen de perfil
const uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "No se ha subido ninguna imagen"
      });
    }

    const userId = req.user.id;

    // Obtener imagen anterior para eliminarla
    const [user] = await dbQuery(
      "SELECT ImagenPerfil FROM usuarios WHERE Id = ?",
      [userId]
    );

    // Eliminar imagen anterior si existe
    if (user.ImagenPerfil) {
      const oldImagePath = path.join(__dirname, "../../uploads", user.ImagenPerfil);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    // Actualizar con nueva imagen
    await dbQuery(
      "UPDATE usuarios SET ImagenPerfil = ?, updated_at = NOW() WHERE Id = ?",
      [req.file.filename, userId]
    );

    res.json({
      success: true,
      message: "Imagen de perfil actualizada correctamente",
      data: {
        imageUrl: `/uploads/${req.file.filename}`
      }
    });
  } catch (error) {
    console.error("[UPLOAD PROFILE IMAGE] Error:", error);
    res.status(500).json({
      success: false,
      error: "Error al subir la imagen de perfil"
    });
  }
};

// Cambiar contraseña
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        error: "La contraseña actual y nueva son obligatorias"
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        error: "La nueva contraseña debe tener al menos 6 caracteres"
      });
    }

    // Obtener usuario con contraseña actual
    const [user] = await dbQuery(
      "SELECT HashPwUsuarios FROM usuarios WHERE Id = ?",
      [userId]
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "Usuario no encontrado"
      });
    }

    // Verificar contraseña actual
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.HashPwUsuarios);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        error: "La contraseña actual es incorrecta"
      });
    }

    // Hashear nueva contraseña
    const hashedNewPassword = await bcrypt.hash(newPassword, 12);

    // Actualizar contraseña
    await dbQuery(
      "UPDATE usuarios SET HashPwUsuarios = ?, updated_at = NOW() WHERE Id = ?",
      [hashedNewPassword, userId]
    );

    res.json({
      success: true,
      message: "Contraseña actualizada correctamente"
    });
  } catch (error) {
    console.error("[CHANGE PASSWORD] Error:", error);
    res.status(500).json({
      success: false,
      error: "Error al cambiar la contraseña"
    });
  }
};

// =============================
// 👥 ADMIN - GESTIÓN DE USUARIOS
// =============================

// Obtener todos los usuarios
const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT Id, NickUsuarios, EmailUsuarios, RolUsuarios, ImagenPerfil, 
             created_at, updated_at 
      FROM usuarios 
    `;
    let countQuery = `SELECT COUNT(*) as total FROM usuarios`;
    const params = [];

    if (search) {
      const searchCondition = ` WHERE NickUsuarios LIKE ? OR EmailUsuarios LIKE ?`;
      query += searchCondition;
      countQuery += searchCondition;
      params.push(`%${search}%`, `%${search}%`);
    }

    query += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`;
    params.push(parseInt(limit), parseInt(offset));

    const [users] = await dbQuery(countQuery, params.slice(0, search ? 2 : 0));
    const results = await dbQuery(query, params);

    res.json({
      success: true,
      data: results.map(user => ({
        id: user.Id,
        nick: user.NickUsuarios,
        email: user.EmailUsuarios,
        rol: user.RolUsuarios,
        imagenPerfil: user.ImagenPerfil ? `/uploads/${user.ImagenPerfil}` : null,
        fechaCreacion: user.created_at,
        fechaActualizacion: user.updated_at
      })),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: users.total,
        pages: Math.ceil(users.total / limit)
      }
    });
  } catch (error) {
    console.error("[GET ALL USERS] Error:", error);
    res.status(500).json({
      success: false,
      error: "Error al obtener los usuarios"
    });
  }
};

// Obtener usuario por ID
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const [user] = await dbQuery(
      `SELECT Id, NickUsuarios, EmailUsuarios, RolUsuarios, ImagenPerfil, 
              created_at, updated_at 
       FROM usuarios 
       WHERE Id = ?`,
      [id]
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "Usuario no encontrado"
      });
    }

    // Solo permitir ver información sensible si es admin o el propio usuario
    if (req.user.rol !== "admin" && req.user.id !== parseInt(id)) {
      return res.status(403).json({
        success: false,
        error: "No tienes permisos para ver este perfil"
      });
    }

    res.json({
      success: true,
      data: {
        id: user.Id,
        nick: user.NickUsuarios,
        email: user.EmailUsuarios,
        rol: user.RolUsuarios,
        imagenPerfil: user.ImagenPerfil ? `/uploads/${user.ImagenPerfil}` : null,
        fechaCreacion: user.created_at,
        fechaActualizacion: user.updated_at
      }
    });
  } catch (error) {
    console.error("[GET USER BY ID] Error:", error);
    res.status(500).json({
      success: false,
      error: "Error al obtener el usuario"
    });
  }
};

// Eliminar usuario
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Evitar que un usuario se elimine a sí mismo
    if (req.user.id === parseInt(id)) {
      return res.status(400).json({
        success: false,
        error: "No puedes eliminar tu propia cuenta"
      });
    }

    const [user] = await dbQuery(
      "SELECT ImagenPerfil FROM usuarios WHERE Id = ?",
      [id]
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "Usuario no encontrado"
      });
    }

    // Eliminar imagen de perfil si existe
    if (user.ImagenPerfil) {
      const imagePath = path.join(__dirname, "../../uploads", user.ImagenPerfil);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    // Eliminar usuario
    await dbQuery("DELETE FROM usuarios WHERE Id = ?", [id]);

    res.json({
      success: true,
      message: "Usuario eliminado correctamente"
    });
  } catch (error) {
    console.error("[DELETE USER] Error:", error);
    res.status(500).json({
      success: false,
      error: "Error al eliminar el usuario"
    });
  }
};

// Cambiar rol de usuario
const changeUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { rol } = req.body;

    if (!rol || !["usuario", "admin", "moderador"].includes(rol)) {
      return res.status(400).json({
        success: false,
        error: "Rol válido requerido: usuario, admin o moderador"
      });
    }

    const [user] = await dbQuery("SELECT Id FROM usuarios WHERE Id = ?", [id]);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "Usuario no encontrado"
      });
    }

    await dbQuery(
      "UPDATE usuarios SET RolUsuarios = ?, updated_at = NOW() WHERE Id = ?",
      [rol, id]
    );

    res.json({
      success: true,
      message: `Rol del usuario actualizado a ${rol}`,
      data: { id: parseInt(id), rol }
    });
  } catch (error) {
    console.error("[CHANGE USER ROLE] Error:", error);
    res.status(500).json({
      success: false,
      error: "Error al cambiar el rol del usuario"
    });
  }
};

// =============================
// 📊 ESTADÍSTICAS
// =============================

const getUserStats = async (req, res) => {
  try {
    const { id } = req.params;

    // Solo permitir ver stats propias o si es admin
    if (req.user.rol !== "admin" && req.user.id !== parseInt(id)) {
      return res.status(403).json({
        success: false,
        error: "No tienes permisos para ver estas estadísticas"
      });
    }

    const [postsCount] = await dbQuery(
      "SELECT COUNT(*) as total FROM posts WHERE user_id = ?",
      [id]
    );

    const [user] = await dbQuery(
      "SELECT created_at FROM usuarios WHERE Id = ?",
      [id]
    );

    res.json({
      success: true,
      data: {
        totalPosts: postsCount.total,
        memberSince: user.created_at,
        accountAge: Math.floor((new Date() - new Date(user.created_at)) / (1000 * 60 * 60 * 24)) // días
      }
    });
  } catch (error) {
    console.error("[GET USER STATS] Error:", error);
    res.status(500).json({
      success: false,
      error: "Error al obtener estadísticas del usuario"
    });
  }
};

module.exports = {
  requireAdmin,
  getProfile,
  updateProfile,
  uploadProfileImage,
  changePassword,
  getAllUsers,
  getUserById,
  deleteUser,
  changeUserRole,
  getUserStats
};