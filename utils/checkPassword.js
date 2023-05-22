 const bcrypt= require('bcrypt');

  const checkPassword = async (password,hash)=>{
    return await bcrypt.compare(password,hash)
}

module.exports= checkPassword;