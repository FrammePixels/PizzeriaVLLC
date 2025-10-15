 import BannerSliders from '../components/BannerSliders.jsx'
import ItemListContainer from '../components/ItemListContainer.jsx'
import Offers from '../pages/Offerts.jsx'
const Home = () => {
  return (
   <div className="bg-black min-h-screen">
    <BannerSliders />
 
   <div className="mt-6 mb-10">
   </div>

  {/* PRODUCTOS */}
  <ItemListContainer />
    <Offers />

</div>

  )
}

export default Home
