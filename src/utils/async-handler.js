//To handle all async-await without using too many trycatch blocks. It auto handles catch part by using express's inbuilt error handler

//Higher-order function that takes function as input and returns function as output and does 2 things
//1. Promise.resolve(input fuctn)    2. Promise.catch((err))

const asyncHandler=(requestHandler) => {
    return (req,res,next) => {
        Promise                     //All the functions that you are assing are promisified=> No need trycatch anymore
        .resolve(requestHandler(req,res,next))
        .catch((err)=> next(err))   //Automatically handles all errors and pass it to express default error handler
    }
}

export {asyncHandler}
//You can use this exact async Handler function in controller of all APIs