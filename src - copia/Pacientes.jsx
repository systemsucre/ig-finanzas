


import { Articulo } from "./components/Articulo"
import { Footer } from "./components/Footer"
import { Header } from "./components/Header"

import { useCart } from "./hooks/useCart"



export function Pacientes() {


    // custom hook
    const { clearCart, decrementQuantity, increaseQuantity, removeToCart, addToCart, cart, data, isEmptyCart, totalCart } = useCart();


    // Render
    return (
        <>

            {/* <MapaIsocronas /> */}
            < Header
                cart={cart}
                removeToCart={removeToCart}
                increaseQuantity={increaseQuantity}
                decrementQuantity={decrementQuantity}
                clearCart={clearCart}
                isEmptyCart={isEmptyCart}
                totalCart={totalCart}
            />

            <main className="container-xl mt-5">
                <h2 className="text-center">Nuestra Colección</h2>
                <div className="row mt-5">

                    
                    {data.map((d) => (
                        <Articulo
                            key={d.id}
                            articulo={d}
                            addToCart={addToCart}
                        />
                    ))}
                </div>
            </main>
            <Footer />

        </>
    )
}

export default Pacientes
