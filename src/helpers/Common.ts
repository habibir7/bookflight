const response = (res:any, result:object,status:any, message:String,pagination:Object)=>{
    const resultPrint:any = {}
    resultPrint.status = 'success'
    resultPrint.statusCode = status
    resultPrint.data = result
    resultPrint.message = message || null
    resultPrint.pagination = pagination || null
    res.status(status).json(resultPrint)
}

module.exports = {response}