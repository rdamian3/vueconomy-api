module.exports = {
  port: process.env.PORT || 3001,
  db:
    process.env.MONGODB_URI ||
    'mongodb+srv://rdamian3:a0Nb1c0JmSAPR76X@cluster0.dni3f.mongodb.net/<dbname>?retryWrites=true&w=majority',
  SECRET_TOKEN: 'miclavedetokens',
  emailUser: 'rdamian3dev@gmail.com',
  emailPassword: '!Dd302010d',
};
