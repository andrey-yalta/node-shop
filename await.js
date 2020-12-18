const delay= (ms)=>{
    return new Promise(r => setTimeout(()=>r(),ms))
}
delay(2000).then(()=>console.log("after 2 sec"))

const url = 'https://jsonplaceholder.typicode.com/todos/1';
// const  fetchTodo = async ()=>{
//     await delay(2000)
//     const response =  await fetch(url)
//     const data = await response.json()
//     console.log(data)
// }
// fetchTodo()
fetch(url)