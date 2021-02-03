function checkerUrl(url) {
    const regex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/gi;
    if (regex.test(url)) {
        return true;
    }
    return false;
}


export { checkerUrl }