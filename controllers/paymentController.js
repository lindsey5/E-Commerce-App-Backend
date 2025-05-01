import errorHandler from "../utils/errorHandler.js";

export const createPaymentCheckout = async (req, res) => {
    try{
        const data = req.body;

        if(!data || data.length < 1) throw new Error("Data is required");

        const options = {
            method: 'POST',
            headers: {
              accept: 'application/json',
              'Content-Type': 'application/json',
              authorization: `Basic ${process.env.PAYMONGO_SECRET}`
            },
            body: JSON.stringify({
              data: {
                attributes: {
                  send_email_receipt: false,
                  show_description: false,
                  show_line_items: true,
                  line_items: data,
                  payment_method_types: ['gcash', 'paymaya']
                }
              }
            })
        };
          
        const response = await fetch('https://api.paymongo.com/v1/checkout_sessions', options)

        const result = await response.json();
        if(response.ok){
            res.status(200).json({ checkout_url: result.data.attributes.checkout_url});
        }else{
           res.status(400).json(result)
        }
    }catch(err){
        const errors = errorHandler(err);
        res.status(500).json({errors});
    }
}