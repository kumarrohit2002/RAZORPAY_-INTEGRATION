const express=require('express');
const app = express();
const cors=require('cors');
const morgan=require('morgan');
const crypto=require('crypto');

const OrderModel=require('./models/Order.model')


app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended:false}));

require("./config/db").connect();

const Razorpay=require('razorpay');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
       key_secret: process.env.RAZORPAY_SECTERT_KEY
});


//routes

app.post('/api/payment/checkout',async(req,res)=>{
    try{
        const {name,amount}=req.body;
        const order = await razorpay.orders.create( {
            amount: Number(amount*100),
            currency: "INR",
        });
        await OrderModel.create({
            name:name,
            amount: amount,
            order_id: order.id
        })
        // console.log(order);
        res.status(200).json({order: order})
    }catch(error){
        console.log(`Error in checkout routes ,Error: ${error}`);
        res.json({
            success: false,
            message:`Error in checkout routes ,Error: ${error.message}`
        })
    }
})

app.post('/api/payment/payment-verification', async (req, res) => {
    try {
        const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

        const body_data = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_SECTERT_KEY)
            .update(body_data)
            .digest('hex');
        const isValid = expectedSignature === razorpay_signature;

        if (isValid) {
            // update in DB
            await OrderModel.findOneAndUpdate(
                { order_id: razorpay_order_id },
                {
                    $set: {
                        razorpay_payment_id: razorpay_payment_id,
                        razorpay_order_id: razorpay_order_id,
                        razorpay_signature: razorpay_signature,
                    }
                }
            );
            res.redirect(`http://localhost:5173/success?payment_id=${razorpay_payment_id}`);
        } else {
            res.redirect("http://localhost:5173/failed");
        }

    } catch (error) {
        console.log(`Error in payment verification, Error: ${error}`);
        res.json({
            success: false,
            message: `Error in payment verification, Error: ${error.message}`
        });
    }
});








const PORT=process.env.PORT

app.listen(PORT,()=>{
    console.log(`listening on port no : http://localhost:${PORT}`);
});

app.get('/',(req,res)=>{
    res.send(`<h1>This is HomePage yaar</h1>`);
})