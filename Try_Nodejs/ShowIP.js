var os = require('os');

var interfaces = os.networkInterfaces();
var addresses = [];
for (var k in interfaces) {
    for (var k2 in interfaces[k]) {
        var address = interfaces[k][k2];
        if (address.family === 'IPv4' && !address.internal) {
            addresses.push(address.address);
        }
    }
}

console.log(addresses);




var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport("SMTP", {
    host: "smtp-mail.outlook.com", // hostname
    secureConnection: false, // TLS requires secureConnection to be false
    port: 587, // port for secure SMTP
    auth: {
        user: "zhao.zhongming@outlook.com",
        pass: "Yunqi1126"
    },
    tls: {
        ciphers:'SSLv3'
    }
});

// setup e-mail data with unicode symbols
var mailOptions = {
    from: '"Raspberry Zhongming" <zhao.zhongming@outlook.com>',
    to: 'zhao.zhongming@live.com',
    subject: 'Raspberry IP:' + addresses,
    text: '',
    html: ''
};

// send mail with defined transport object
transporter.sendMail(mailOptions, function(error, info){
    if(error){
        return console.log(error);
    }
    console.log('Message sent: ' + info.response);
	process.exit()
});

