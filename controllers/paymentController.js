import errorHandler from "../utils/errorHandler.js";

export const createPaymentCheckout = async (req, res) => {
    try{
        const { items, address, user } = req.body;

        if(!items || items.length < 1) throw new Error("Items is required");
        const line_items = items.map(item => ({ 
          images: [item.image],
          currency: "PHP", 
          amount: item.price * 100, 
          name: `${item.name} ${item.color} | ${item.size}`,  
          quantity: item.quantity }
        ))

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
                  cancel_url: 'http://localhost:8081',
                  send_email_receipt: true,
                  show_description: false,
                  show_line_items: true,
                  line_items,
                  payment_method_types: ['gcash', 'paymaya'],
                  metadata: { 
                    items: JSON.stringify(items),
                    address: JSON.stringify(address),
                    user: JSON.stringify(user)
                  }
                }
              }
            })
        };
          
        const response = await fetch('https://api.paymongo.com/v1/checkout_sessions', options)

        const result = await response.json();
        if(response.ok){
            res.status(200).json({ data: result.data, checkout_url: result.data.attributes.checkout_url});
        }else{
            console.log(result)
           res.status(400).json(result)
        }
    }catch(err){
        const errors = errorHandler(err);
        res.status(500).json({success: false, errors});
    }
}