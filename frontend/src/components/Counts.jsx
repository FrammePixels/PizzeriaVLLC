import { useItemCount } from '../hooks/useItemCounts'

const Counts = () => {
  const { count, Increment, Decrement, addToShop } = useItemCount()


 
 

  return (
    <div className="flex flex-col items-center gap-4 p-4 bg-gray-800 rounded-lg w-64">
      <div className="flex items-center gap-4">
        <button
          onClick={Decrement}
          className="bg-red-500 hover:bg-red-600 text-white font-bold px-4 py-2 rounded"
        >
          -
        </button>
        <span className="text-white text-xl font-semibold">{count}</span>
        <button
          onClick={Increment}
          className="bg-green-500 hover:bg-green-600 text-white font-bold px-4 py-2 rounded"
        >
          +
        </button>
      </div>
      <button
        onClick={addToShop}
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2 rounded w-full"
      >
        Agregar al carrito
      </button>
    </div>
  )
}

export default Counts
