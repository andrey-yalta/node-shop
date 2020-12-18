const path = require("path")
const fs = require("fs")

const p = path.join(__dirname, '..', 'data', 'card.json')
const p1 = path.join(path.dirname(process.mainModule.filename), "data", "card.json")

class Card{
    static async add(course){
        const card = await Card.fetch()
        const index = card.courses.findIndex(c => c.id=== course.id)
        const candidate = card.courses[index]
        if(candidate){
            //курс уже есть
            candidate.count++
            card.courses[index] = candidate
        }
        else {
            // курса нет, нужно добавить
            course.count = 1
            card.courses.push(course)
        }
        //плюс в начале course.price означает что мы приводим переенную в int значение
        card.price += +course.price

        return new Promise((resolve, reject)=>{
            fs.writeFile(p, JSON.stringify(card), err=>{
                if(err){reject(err)}
                else{
                    resolve()
                }
            })
        })
    }
    static async remove(id) {
        const card = await Card.fetch()

        const idx = card.courses.findIndex(c => c.id === id)
        const course = card.courses[idx]

        if (course.count === 1) {
            // удалить
            card.courses = card.courses.filter(c => c.id !== id)
        } else {
            // изменить количество
            card.courses[idx].count--
        }

        card.price -= course.price

        return new Promise((resolve, reject) => {
            fs.writeFile(p, JSON.stringify(card), err => {
                if (err) {
                    reject(err)
                } else {
                    resolve(card)
                }
            })
        })
    }

    //fetch = означат получить
    static async fetch(){

        return new Promise((resolve, reject)=>{
            fs.readFile(p, "utf-8", (err,content)=>{
                if(err){reject(err)}
                else{resolve(JSON.parse(content))}

            })
        })
    }
}
module.exports = Card