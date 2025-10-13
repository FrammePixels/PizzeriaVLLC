import React from 'react'
import ItemListContainer from '../components/ItemListContainer.jsx'

const Home = () => {
  return (
    <div>
      {/* Header opcional */}
      <div className="text-center py-8 bg-gray-950">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">
          CYBER_STORE_2077
        </h1>
        <p className="text-cyan-300 mt-2">Bienvenido al futuro del comercio</p>
      </div>
      
      {/* Mostrar productos directamente */}
      <ItemListContainer />
    </div>
  )
}

export default Home