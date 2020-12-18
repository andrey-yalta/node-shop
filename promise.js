// асинхронные операции - эмуляция работы с сервером
console.log("hello cerver")

// setTimeout(()=>{
//     console.log("hello cerver q")
//     const data = {
//         "name":"andrey"
//     }
//     setTimeout(()=>{
//         data.port = 2000
//         console.log("hello server 3 ", data)
//     },2000)
// }, 1500)
// в чем проблема ??? большая вложенность
// решение - промисы

// ИСПОЛЬЗУЕМ ПРОМИСЫ

// const p = new Promise((resolve, reject)=>{
//     setTimeout(()=>{
//         console.log("hello cerver q")
//         const data = {
//             "name":"andrey"
//         }
//         resolve(data) // передаём параметры, которые хотим изменят в дальнейшем в then
//     },2000)
//
// })
//
// //метод then будет вызван тогда, когда будет выполнен resolve
// p.then((data)=>{
//     return new Promise((resolve, reject)=>{
//         setTimeout(()=>{
//             data.port = 2000
//             resolve(data)
//             // reject(data) /// это короче метод чтобы возвращаться ошибку
//     },2000)
//     })
// })
//     .catch(err => console.log(err)) // ловим ошибку
//     .then(clientData=>{
//     console.log("hello server 3 ", clientData)
//     clientData.http = "s"
//     return clientData
//     }).then(modData=>{console.log(modData)})
//     .finally(()=>{
//         console.log("finally")
//     }) // файнали всегда вызывается в конце, независимо есть или нет ошибка

// ИСПОЛЬЗУЕМ СЛИП

const sleep = ms =>
{ return new Promise((resolve)=>{
    setTimeout(()=>resolve(), ms)
    })
}

sleep(2000).then(()=>console.log("after 2000"))
sleep(3000).then(()=>console.log("after 3000"))

