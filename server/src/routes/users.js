const express = require("express");
const { verificarToken } = require("../middleware/authMiddleware");
const { upload } = require("../utils/uploadConfig");
const userController = require("../controllers/userController");

const router = express.Router();

// =============================
// 🎯 PERFIL DE USUARIO
// =============================

// Obtener perfil del usuario actual
router.get("/profile", verificarToken, userController.getProfile);

// Actualizar perfil de usuario
router.put("/profile", verificarToken, userController.updateProfile);

// Subir imagen de perfil
router.post("/profile/image", verificarToken, upload.single("imagenPerfil"), userController.uploadProfileImage);

// Cambiar contraseña
router.patch("/change-password", verificarToken, userController.changePassword);

// =============================
// 👥 ADMIN - GESTIÓN DE USUARIOS
// =============================

// Obtener todos los usuarios (solo admin)
router.get("/", verificarToken, userController.requireAdmin, userController.getAllUsers);

// Obtener usuario por ID
router.get("/:id", verificarToken, userController.getUserById);

// Actualizar usuario (solo admin o propio usuario)
router.put("/:id", verificarToken, userController.updateUser);

// Eliminar usuario (solo admin)
router.delete("/:id", verificarToken, userController.requireAdmin, userController.deleteUser);

// Cambiar rol de usuario (solo admin)
router.patch("/:id/role", verificarToken, userController.requireAdmin, userController.changeUserRole);

// =============================
// 📊 ESTADÍSTICAS
// =============================

// Obtener estadísticas del usuario
router.get("/:id/stats", verificarToken, userController.getUserStats);

module.exports = router;