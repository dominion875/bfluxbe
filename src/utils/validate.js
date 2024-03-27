const regex = new RegExp("[a-z0-9]+@[a-z]+.[a-z]{2,3}");
const phoneRegex = new RegExp("[0-9]{11}")

const isEmailvalid = (email) =>{
    return regex.test(email)
}

const isPhoneNumberValid = (number)=>{
    if(isNaN(number))return false;
    if(number.charAt(0) !== "0")return false;
    return phoneRegex.test(number)
}

module.exports = {
    isEmailvalid,
    isPhoneNumberValid
}


//write a function to check if the user phone number is truely a nigerian number