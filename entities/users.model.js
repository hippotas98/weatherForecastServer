const mongoose = require('mongoose')

let UserSchema = mongoose.Schema({
    email: {
          type: String, 
          trim: true, 
          match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    },
    facebookProvider: {
          type: {
                id: String,
                token: String,
                display_name: String
          },
          select: false
    },
    googleProvider: {
      type: {
            id: String,
            token: String,
            display_name: String
      },
      select: false
    }
  });
  UserSchema.set('toJSON', {getters: true, virtuals: true});
  UserSchema.statics.upsertFbUser = function(accessToken, refreshToken, profile, cb) {
    var that = this;
    return this.findOne({
          'facebookProvider.id': profile.id
    }, function(err, user) {
      // no user was found, lets create a new one
      if (!user) {
            console.log(profile)
            var newUser = new that({
                  email: profile.emails[0].value,
                  role: 1,
                  facebookProvider: {
                        id: profile.id,
                        token: accessToken,
                        display_name: profile.displayName,
                        picture: "http://graph.facebook.com/"+profile.id+"/picture?type=square"
                  }
            });

            newUser.save(function(error, savedUser) {
              if (error) {
                    console.log(error);
              }
              return cb(error, savedUser);
        });
      } else {
            return cb(err, user);
      }
    });
  };
  UserSchema.statics.upsertGoogleUser = function(accessToken, refreshToken, profile, cb) {
      var that = this;
      return this.findOne({
            'googleProvider.id': profile.id
      }, function(err, user) {
        // no user was found, lets create a new one
        if (!user) {
              console.log(profile)
              var newUser = new that({
                    email: profile.emails[0].value,
                    googleProvider: {
                          id: profile.id,
                          token: accessToken,
                          display_name: profile.displayName,
                          name: profile.name,
                          picture: profile.picture,
                    }
              });
              newUser.save(function(error, savedUser) {
                if (error) {
                      console.log(error);
                }
                return cb(error, savedUser);
          });
        } else {
              return cb(err, user);
        }
      });
    };
 module.exports = UserSchema
