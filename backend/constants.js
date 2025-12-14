const SALT_ROUND = 10;
const  GENERIC_MESSAGE = (status, message, extra = {}) => ({
    status: status, message, ...extra
});
const PORT = 3000;
const INTERNAL_ERROR_MESSAGE = "Internal Server Error";

// Empty error Message
const EMPTY_ERROR_MESSAGE = "cannot be empty";
const EMAIL_EMPTY_ERROR_MESSAGE = "Email " + EMPTY_ERROR_MESSAGE;
const FIRST_NAME_EMPTY_ERROR_MESSAGE = "First Name " + EMPTY_ERROR_MESSAGE;
const LAST_NAME_EMPTY_ERROR_MESSAGE = "Last Name " + EMPTY_ERROR_MESSAGE;
const PASSWORD_EMPTY_ERROR_MESSAGE = "Password " + EMPTY_ERROR_MESSAGE;


const EMAIL_NOT_FOUND = "Email not found";
const INVALID_CREDENTIALS = "Invalid Credentials";

const USER_ALREADY_EXISTS = "User already exists";

// JWT Configs
const VALIDITY_DAYS = 2;
const JWT_TOKEN_VALIDITY = Math.floor(Date.now()/1000) + (VALIDITY_DAYS * 24 * 60 * 60);

const SUCCESSFUL_LOGIN = "Login Successful";

const TOKEN_NOT_PROVIDED = "Authentication token not provided in header";

const DOCUMENT_TITLE_EMPTY_ERROR_MESSAGE = "Document Title " + EMPTY_ERROR_MESSAGE;

const USER_ID_EMPTY_ERROR_MESSAGE = "User ID " + EMPTY_ERROR_MESSAGE;

const USER_NOT_LOGGED_IN = "User Not Logged In"

const USER_SUCCESSFULY_REGISTERED = "User successfuly registered";

const USER_LOGGED_IN_OBJECT = (loggedIn) => ({
    loggedIn: loggedIn
})

const DOCUMENT_CREATED_SUCCESSFULY = "Document Created successfuly";

const DOCUMENT_ID_EMPTY_ERROR_MESSAGE = "Document ID " + EMPTY_ERROR_MESSAGE;

const INVALID_DOCUMENT = "Invalid Document";

const NOT_AUTHORISED_TO_DELETE_DOCUMENT = "You are not authorized to delete this document";

const DOCUMENT_DELETED_SUCCESSFULY = "Document deleted successfuly";

const DOCUMENT_FOUND_SUCCESSFULY = "Document found successfuly";

const SHARED_USER_EMAIL_EMPTY_ERROR_MESSAGE = "Shared user email " + EMPTY_ERROR_MESSAGE;

const ALL_COLORS = [
    "yellow",       // #FFFF00
    "green",        // #00FF00
    "blue",         // #0000FF
    "indigo",       // #4B0082
    "purple",       // #800080
    "pink",         // #FFC0CB
    "orange",       // #FFA500
    "brown",        // #A52A2A
    "cyan",         // #00FFFF
    "teal",         // #008080
    "lime",         // #00FF00
    "amber",        // #FFBF00
    "emerald",      // #50C878
    "rose",         // #FF007F
    "violet",       // #8A2BE2
    "fuchsia",      // #FF00FF
    "chartreuse",   // #7FFF00
    "mint",         // #98FF98
    "navy",         // #000080
    "tan",          // #D2B48C
    "plum",         // #DDA0DD
    "lavender",     // #E6E6FA
    "gold",         // #FFD700
    "silver",       // #C0C0C0
    "coral",        // #FF7F50
    "lightblue",    // #ADD8E6
    "skyblue",      // #87CEEB
    "orchid",       // #DA70D6
    "limegreen",    // #32CD32
    "darkgreen",    // #006400
    "salmon",       // #FA8072
    "chocolate",    // #D2691E
    "tan",          // #D2B48C
    "peach",        // #FFDAB9
  ];
  
const SHARED_DOCUMENT_CREATED = "Shared document created successfuly";
const DOCUMENT_NOT_FOUND = "Document not found";
const YOU_ARE_NOT_OWNER = "You are not owner of the document";

module.exports = {
    PORT,
    GENERIC_MESSAGE,
    INTERNAL_ERROR_MESSAGE,
    EMAIL_EMPTY_ERROR_MESSAGE,
    FIRST_NAME_EMPTY_ERROR_MESSAGE,
    LAST_NAME_EMPTY_ERROR_MESSAGE,
    PASSWORD_EMPTY_ERROR_MESSAGE,
    EMAIL_NOT_FOUND,
    INVALID_CREDENTIALS,
    USER_ALREADY_EXISTS,
    JWT_TOKEN_VALIDITY,
    SUCCESSFUL_LOGIN,
    TOKEN_NOT_PROVIDED,
    SALT_ROUND,
    USER_LOGGED_IN_OBJECT,
    DOCUMENT_TITLE_EMPTY_ERROR_MESSAGE,
    USER_ID_EMPTY_ERROR_MESSAGE,
    USER_NOT_LOGGED_IN,
    DOCUMENT_CREATED_SUCCESSFULY,
    DOCUMENT_ID_EMPTY_ERROR_MESSAGE,
    INVALID_DOCUMENT,
    NOT_AUTHORISED_TO_DELETE_DOCUMENT,
    DOCUMENT_DELETED_SUCCESSFULY,
    DOCUMENT_FOUND_SUCCESSFULY,
    USER_SUCCESSFULY_REGISTERED,
    ALL_COLORS,
    SHARED_USER_EMAIL_EMPTY_ERROR_MESSAGE,
    SHARED_DOCUMENT_CREATED,
    DOCUMENT_NOT_FOUND,
    YOU_ARE_NOT_OWNER
}