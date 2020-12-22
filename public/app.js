
const toCurrency = price =>{
    return new Intl.NumberFormat("ru-RU", {
        currency: 'rub',
        style:"currency"
    }).format(price)
}
document.querySelectorAll(".price").forEach(node=>{
    node.textContent = toCurrency(node.textContent)
})


//обычно $ в начале переменной означчает что мы будем использовать html или jquery обьект
const $card = document.querySelector("#card")
if($card){
    // здесь обрабаываем нажатие на элемент с классом card
    $card.addEventListener("click", event=>{
        // здесь проверяем есть ли у элемента, на который нажали, класс js-remove
        if (event.target.classList.contains('js-remove')){
            // если есть, то берем значение у этого элемена id
            const id = event.target.dataset.id
            debugger;
            fetch('/card/remove/' + id, {
                method: 'delete'

            }).then(res => res.json()).then(card =>{
                if(card.courses.length){
                    const html = card.courses.map(c=>{
                        return ` 
                        <tr>
                        <td>${c.title}</td>
                        <td>${c.count}</td>
                        <td>
                            <button class="btn btn-small js-remove" data-id="${c.id}">delete</button>
                        </td>
                        </tr>`
                    }).join("")
                    $card.querySelector("tbody").innerHTML = html
                    $card.querySelector(".price").textContent = toCurrency(card.price)

                }
                else{
                    $card.innerHTML ='<p> Card is empty</p>'
                }
            })


        }
    })

}

const toDate = date =>{
    return new Intl.DateTimeFormat("ru-RU", {
        day:"2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    }).format(new Date(date))

}
document.querySelectorAll(".date").forEach(node =>{
    node.textContent = toDate(node.textContent)
})


// инициализация табов в странице логина

M.Tabs.init(document.querySelectorAll('.tabs'));