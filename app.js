var express = require('express');
var bodyParser = require('body-parser');
//var exphbs = require('express-handlebars');
var nodemailer = require('nodemailer');
var path = require('path');

var app = express();

// View Engine Setup
//app.engine('handlebars',exphbs());
//app.set('view engine', 'handlebars');
app.set('view engine','ejs');

// Static Folder
app.use('/public', express.static(path.join(__dirname, 'public')));

// BodyParser Middleware
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.get('/',function(req, res){
    res.render('contact');
});

app.post('/send', function(req, res){
    var output = `<p>You have a new contact request</p> 
    <h3>Contact Details</h3>
    <ul>
        <li>First Name : <%= req.body.first_name %></li>
        <li>Last Name : <%= req.body.last_name %></li>
        <li>Email : <%= req.body.email %></li>
    </ul>
    <h3>Message</h3>
    <p><%= req.body.message %></p>`;
    // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: 'mail.YOURDOMAIN.com',
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: 'YOUREMAIL', // generated ethereal user
                pass: 'YOURPASSWORD'  // generated ethereal password
            },
            tls:{
            rejectUnauthorized:false
            }
        });

        // setup email data with unicode symbols
        let mailOptions = {
            from: '"Nodemailer Contact" <your@email.com>', // sender address
            to: 'RECEIVEREMAILS', // list of receivers
            subject: 'Node Contact Request', // Subject line
            text: 'Hello world?', // plain text body
            html: output // html body
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message sent: %s', info.messageId);   
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

            res.render('contact', {msg:'Email has been sent'});
        });
        });

app.listen(3000, function() {
    console.log("Server starts....");
});