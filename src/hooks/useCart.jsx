import { useEffect, useState } from "react"
import { useMemo } from "react"
import { db } from '../data/db'

export const useCart = () => {

    const initialCart = () => {
        const localStorageCart = localStorage.getItem('cart');
        if (localStorageCart) {

            setTimeout(() => {
                cart?.forEach(item => {
                    const itemCartText = document?.getElementById("span" + item.id);
                    if (itemCartText)
                        itemCartText.textContent = item.quantity + (item.quantity > 1 ? ' ordenes' : ' orden');
                });
            }, 2300)

            return JSON.parse(localStorageCart);
        }
        else {
            return []
        }
    }
    const [data, setData] = useState([])
    const [cart, setCart] = useState(initialCart)

    const MAX_ITEMS_CART = 10;

    useEffect(() => {
        setData(db)

    }, [])

    useEffect(() => {

        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart])


    function addToCart(item) {

        const itemExists = cart.findIndex(cartItem => cartItem.id === item.id);
        if (itemExists >= 0) {

            if (cart[itemExists].quantity >= MAX_ITEMS_CART) return
            const updateCart = [...cart];
            updateCart[itemExists].quantity++;
            setCart(updateCart);

            const itemCartText = document.getElementById("span" + item.id);
            itemCartText.textContent = cart[itemExists].quantity + (cart[itemExists].quantity > 1 ? ' ordenes' : ' orden');

        } else {
            item.quantity = 1;
            setCart([...cart, item])

            const itemCartText = document.getElementById("span" + item.id);
            itemCartText.textContent = ('1 orden');

        }

    }


    function removeToCart(id) {
        setCart(cart.filter(item => item.id !== id));

        const itemCartText = document.getElementById("span" + id);
        itemCartText.textContent = '';
    }


    function increaseQuantity(id) {
        const updateCart = cart.map(item => {
            if (item.id === id && item.quantity < MAX_ITEMS_CART) {
                return { ...item, quantity: item.quantity + 1 }
            }
            return item;
        })
        setCart(updateCart);
        const item = updateCart.find(item => item.id === id);
        const itemCartText = document.getElementById("span" + id);
        itemCartText.textContent = item.quantity + (item.quantity > 1 ? ' ordenes' : ' orden');
    }


    function decrementQuantity(id) {
        const updateCart = cart.map(item => {
            if (item.id === id && item.quantity > 1) {
                return { ...item, quantity: item.quantity - 1 }
            }
            return item;
        })
        setCart(updateCart);
        const item = updateCart.find(item => item.id === id);
        const itemCartText = document.getElementById("span" + id);
        itemCartText.textContent = item.quantity + (item.quantity > 1 ? ' ordenes' : ' orden');
    }


    function clearCart() {
        setCart([]);
        const itemCartTexts = document.querySelectorAll("[id^='span']");
        itemCartTexts.forEach(item => {
            item.textContent = '';
        });
    }


    const isEmptyCart = useMemo(() => {
        return cart.length === 0;
    }, [cart.length]);


    const totalCart = useMemo(() => cart.reduce((sum, item) => sum + (item.price * item.quantity), 0), [cart])


    return { clearCart, decrementQuantity, increaseQuantity, removeToCart, addToCart, cart, data, isEmptyCart, totalCart }
}