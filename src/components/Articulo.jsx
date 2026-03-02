export function Articulo({ articulo, addToCart }) {

    const { id, name, image, description, price } = articulo


    return (
        <div className="col-md-6 col-lg-4 my-4 row align-items-center" id={id}>
            <div className="col-4">
                <img className="img-fluid"
                    src={`./img/${image}.jpg`}
                    alt={name} />
            </div>
            <div className="col-8">
                <h3 className="text-black fs-4 fw-bold text-uppercase">{name}</h3>

                <p>{description}</p>
                <p className="fw-black text-primary fs-3">${price}</p>
                <p  id={'span' + id} 
                className="text-success  fw-bold text-center"
                ></p>

            <button
                type="button"
                className="btn btn-dark w-100"
                onClick={() => addToCart(articulo)}
            >Agregar al Carrito </button>
        </div>
        </div >
    )
}