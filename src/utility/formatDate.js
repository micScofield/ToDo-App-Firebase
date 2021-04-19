function formatDate(seconds) {
    let date = new Date(seconds * 1000)

    return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}  ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
}

export default formatDate;