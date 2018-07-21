var express = require('express');
var app = express();
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
var bodyParser = require('body-parser');
var mongodbURL = process.env.MONGODB_URI || "mongodb://localhost/bengatunes";
var fs = require('fs');
var path = require('path');
var formidable = require('formidable');
var port = process.env.PORT || 80;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static(__dirname + '/dist/benzatunes'));
app.use(express.static(__dirname + '/data/images/bands'));

app.post('/uploadBand', function (req, res) {
    var form = formidable.IncomingForm();

    form.parse(req, function (err, fields, files) {
        if (err) {
            console.log('Error in uploading file: ', err);
            res.json({ success: false, data: 'Something went wrong. Please try again.' });
        } else {
            var tempFilePath = files.image.path;
            console.log('tempFilePath:', tempFilePath);
            var newFileName = fields.title + String(files.image.name).substr(String(files.image.name).indexOf("."));
            console.log('newFileName:', newFileName);

            var newFilePath = "./data/images/bands/" + newFileName;
            console.log('newFilePath:', newFilePath);
            Band.findOne({ title: fields.title }, function (err, band) {
                if (err) {
                    console.log('error in finding details');
                    res.json({ success: false, data: 'could not added the band server error' });
                } else if (!band) {
                    fs.rename(tempFilePath, newFilePath, function (err) {
                        if (err) {
                            console.log('Error in saving file: ', err);
                            res.json({ success: false, data: 'Something went wrong. Please try again...' });
                        } else {
                            console.log('File saved successfully.');
                            band = new Band({
                                title: fields.title,
                                imageurl: "\/" + newFileName,
                                content: fields.content
                            });
                            band.save(function (err) {
                                if (err) {
                                    console.log('Error in saving band:', err);
                                    fs.unlink(newFilePath, function (err) {
                                        if (err) {
                                            console.log('Error in deleting file: ', err);
                                        } else {
                                            console.log('Image deleted successfully');
                                        }
                                    });
                                    res.json({ success: false, data: 'Unable to create band. Try again later...' });
                                } else {
                                    console.log('Band created successfully');
                                    res.json({ success: true, data: 'Band created successfully' });
                                }
                            });
                        }
                    });
                }else{
                    console.log('the band already exist with the same title');
                    res.json({success:false,data:'Duplicate band name, Band already exist with this name. plese try with another name'});
                }
            })

        }
    });
});

app.post('/updateBand', function (req, res) {
    var form = formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        if (err) {
            console.log('error in updating the band');
            res.json({ success: false, data: 'error occured while updating' })
        } else {
            var tempFilePath = files.image.path;
            console.log('termporary path is :', tempFilePath);
            var newFileName = fields.title + String(files.image.name).substr(String(files.image.name).indexOf("."));
            var newFilePath = './data/images/bands/' + newFileName;
            var imageurl = "\/" + newFileName;

            var id = fields.id;
            var oldFileName = '';
            var oldFilePath = '';
            Band.findById(id, function (err, data) {
                if (err) {
                    console.log('id does not present');
                } else {
                    oldFileName = String(data.imageurl).substr(String(data.imageurl).indexOf("/"));
                    console.log('oldFile name is ', oldFileName);
                    oldFilePath = './data/images/bands' + oldFileName;
                    console.log('old image url is :', oldFilePath);
                    console.log('new file name is', newFileName);
                    console.log('new file path is :', newFilePath);
                    console.log('image url for new file path is :', imageurl);
                    fs.unlink(oldFilePath, function (err) {
                        if (err) {
                            console.log('could not updated the image');
                        } else {
                            fs.rename(tempFilePath, newFilePath, function (err) {
                                if (err) {
                                    console.log('error in saving file');
                                    res.json({ success: false, data: 'error in saving the file' });
                                } else {
                                    console.log('file saved successfully');

                                    Band.findByIdAndUpdate(id, { $set: { title: fields.title, imageurl: imageurl, content: fields.content } }, { new: true }, function (err, data) {
                                        if (err) {
                                            console.log('could not updated the band');
                                            res.json({ success: false, data: 'unable to update' });
                                        } else {
                                            console.log('successfully updated the image');
                                            console.log('successfully updated the band');
                                            res.json({ success: true, data: data });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    });

});

app.post('/deleteBand', function (req, res) {
    var id = req.body.bandId;
    if (!id) {
        console.log('id could not be get');
        res.json({ success: false, data: 'id could not be find' });
    } else {
        Band.findById(id, function (err, data) {
            if (err) {
                console.log('error occured in deleting the band');
                res.json({ success: false, data: 'error in deleting the band' });
            } else {
                var fileName = String(data.imageurl).substr(String(data.imageurl).indexOf("/"));
                var filePath = './data/images/bands' + fileName;
                console.log('the filepath for file deleting is ', filePath);
                Band.findByIdAndRemove(id, function (err) {
                    if (err) {
                        console.log('error in deleting the band');
                        res.json({ success: false, data: 'error in deleting the band' });
                    } else {
                        fs.unlink(filePath, function (err) {
                            if (err) {
                                console.log('error in deleting the image');
                                res.json({ success: false, data: 'the band could not be deleted' });
                            } else {
                                console.log('band image deleted successfully');
                                res.json({ success: true, data: 'the band deleted successfully' });

                            }
                        });
                    }
                });
            }
        });
    }
});

mongoose.connect(mongodbURL, function (err) {
    if (err) {
        console.log('Error in connecting to database: ', err);
    } else {
        console.log('Succesfully connected to ', mongodbURL);
    }
});

app.get('/*', function (req, res) {
    console.log('GET request on ', req.url);
    res.sendFile(__dirname + '/dist/benzatunes/index.html');
});


var UserSchema = new mongoose.Schema({
    username: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    }
});

var BandSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },

    imageurl: {
        type: String,
        required: true
    },

    content: {
        type: String,
        required: true
    }

});

var Band = mongoose.model('Band', BandSchema);
var User = mongoose.model('User', UserSchema);

app.post('/register', function (req, res) {
    console.log("User trying to register with: ", req.body);

    var user = new User({
        username: req.body.username,
        password: req.body.password
    });

    user.save(function (err) {
        if (err) {
            console.log('Error in creating user: ', err);
            res.json({ success: false, data: 'Something went wrong. Please try again...' });
        } else {
            console.log('User created successfully: ', user);
            res.json({ success: true, data: 'Account created successfully' });
        }
    });
});
app.post('/login', function (req, res) {
    var username = req.body.username;
    var password = req.body.password;
    User.findOne({ username: username, password: password }, function (err, user) {
        if (err) {
            console.log(err);
            res.json({ success: false, data: 'Error in finding user name' });
        }
        else if (!user) {
            console.log('error in finding user');
            res.json({ success: false, data: 'Either Username or Password is wrong' });
        }
        else {
            console.log('succesfully loged in:', user);
            res.json({ success: true, data: 'login successful' });
        }
    });
});

app.post('/updatePassword', function (req, res) {
    var username = req.body.username;
    var password = req.body.password;
    var newPassword = req.body.newPassword;
    User.findOne({ username: username, password: password }, function (err, user) {
        if (err) {
            console.log(err);
            res.json({ success: false, data: 'error in finding user name' });
        } else if (!user) {
            console.log('error in finding user');
            res.json({ success: false, data: 'user does not exist' });

        } else {
            var userId = user._id;
            User.findByIdAndUpdate(userId, { $set: { username: username, password: newPassword } }, { new: true }, function (err, data) {
                if (err) {
                    console.log(err);
                    res.json({ success: true, data: 'user password could not be updated' });
                } else {
                    console.log('user password upadated successfully');
                    res.json({ success: true, data: 'password changed successfully' });
                }
            });
        }
    });
});

app.post('/bands', function (req, res) {
    Band.find({}, function (err, bands) {
        if (err) {
            console.log('Error in fetching bands: ', err);
            res.json({ success: false, data: 'Unable to fetch bands. Please try again...' });
        } else {
            res.json({ success: true, data: bands });
        }
    });
})

try {
    app.listen(port, function (err) {
        if (err) {
            console.log('Error in starting server: ', err);
        } else {
            console.log('Server started successfully on port 80...');
        }
    });
} catch (e) {
    console.log(e);
}
