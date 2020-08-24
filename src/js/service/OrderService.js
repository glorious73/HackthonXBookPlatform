export default class BookService {
    constructor(fetchService, accountService) {
        this.fetchService = fetchService;
        this.accountService = accountService;
        this.baseUrl   = "https://hackathonxbookplatform.herokuapp.com";
        this.addOrderPath = "/api/Order";
    }

    async addOrder(book) {
        // build headers
        const user = JSON.parse(this.accountService.getUserFromLocalStorage());
        const token = user.user.token;
        const headers = this.buildHeaders(`Bearer ${token}`);
        // build body
        const body = this.buildOrderBody(user, book);
        // Request
        const response = await this.fetchService.performPostHttpRequest(`${this.baseUrl}${this.addOrderPath}`, headers, body);
        if(response.success) {
            alert(`Order has been placed for the book ${book.title}.`);
            window.location = "/index.html";
        }
        else
            alert(`An error occured: ${response.result}`);
    }

    buildHeaders(authorization = null) {
        const headers = {
            "Content-Type": "application/json",
            "Authorization": (authorization) ? authorization : "Bearer ",
        };
        return headers;
    }

    buildOrderBody(user, book) {
        const body = {
            "BookId": book.id,
            "OrderedById": user.user.id,
            "OrderedFromId": book.user.id,
            "OrderTypeCode": 2,
            "Comment": "test",
            "ReturnDate": "2020-08-22T19:05:23.771Z"
        };
        return body;
    }

    buildJsonFormData(form) {
        const jsonFormData = { };
        for(const pair of new FormData(form)) {
            jsonFormData[pair[0]] = pair[1];
        }
        return jsonFormData;
    }
}