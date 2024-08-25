import Card from "../components/Card";
import axios from 'axios'


const Products = () => {

    const CheckoutHandler=async({name,amount})=>{
        const {data:{order}}=await axios.post("http://localhost:5000/api/payment/checkout",{name,amount});
        // console.log({order});
        // console.log(name+" "+amount);
        const options = {
            key: 'rzp_test_TgbjbhWB0DWlDI', // Replace with your Razorpay key_id
            amount: order.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
            currency: order.currency,
            name: 'Rohit Kumar',
            description: 'Test Transaction',
            order_id: order.id, // This is the order_id created in the backend
            callback_url: 'http://localhost:5000/api/payment/payment-verification', // Your success URL
            prefill: {
              name: 'Gaurav Kumar', //jopayment kar raha hai uska details
              email: 'gaurav.kumar@example.com',
              contact: '9999999999'
            },
            theme: {
              color: '#F37254'
            },
          };
    
          const rzp = new window.Razorpay(options);
          rzp.open(options);
    }




    return (
        <div>
            <section className="text-gray-600 body-font">
                <div className="container px-5 py-24 mx-auto">
                    <div className="flex flex-wrap -m-4">
                        <Card checkoutHandler={CheckoutHandler}/>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Products;