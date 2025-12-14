const express = require("express");
const path = require("path");
const {
  GENERIC_MESSAGE,
  TOKEN_NOT_PROVIDED,
  USER_LOGGED_IN_OBJECT,
  EMAIL_EMPTY_ERROR_MESSAGE,
  DOCUMENT_TITLE_EMPTY_ERROR_MESSAGE,
  USER_ID_EMPTY_ERROR_MESSAGE,
  USER_NOT_LOGGED_IN,
  DOCUMENT_CREATED_SUCCESSFULY,
  DOCUMENT_ID_EMPTY_ERROR_MESSAGE,
  INTERNAL_ERROR_MESSAGE,
  INVALID_DOCUMENT,
  NOT_AUTHORISED_TO_DELETE_DOCUMENT,
  DOCUMENT_DELETED_SUCCESSFULY,
  DOCUMENT_FOUND_SUCCESSFULY,
  SHARED_USER_EMAIL_EMPTY_ERROR_MESSAGE,
  SHARED_DOCUMENT_CREATED,
  DOCUMENT_NOT_FOUND,
  YOU_ARE_NOT_OWNER,
  EMAIL_NOT_FOUND
} = require(path.join(__dirname, "..", "..", "constants"));
const { verify_user_with_token } = require(path.join(
  __dirname,
  "..",
  "authRouter",
  "jwt"
));
const documentSchema = require(path.join(
  __dirname,
  "..",
  "..",
  "models",
  "Document"
));
const userSchema = require("../../models/User");
const sharedDocument = require(path.join(__dirname, "..", "..","models", "SharedDocument"));
const { mongoObjectId } = require(path.join(__dirname, "..", "..", "dbConnect"));
const documentRouter = express.Router();

documentRouter.post("/create", async (req, res) => {
  try {
    const token = req.headers.authtoken;
    const email = req.body.email;
    const documentTitle = req.body.documentTitle;
    const userId = req.body.userId;
    if (!token) {
      return res.json(
        GENERIC_MESSAGE(false, TOKEN_NOT_PROVIDED, USER_LOGGED_IN_OBJECT(false))
      );
    }
    if (!email) {
      return res.json(GENERIC_MESSAGE(false, EMAIL_EMPTY_ERROR_MESSAGE));
    }
    if (!documentTitle) {
      return res.json(
        GENERIC_MESSAGE(false, DOCUMENT_TITLE_EMPTY_ERROR_MESSAGE)
      );
    }
    if (!userId) {
      return res.json(GENERIC_MESSAGE(false, USER_ID_EMPTY_ERROR_MESSAGE));
    }
    if (!verify_user_with_token(token, userId, email)) {
      return res.json(
        GENERIC_MESSAGE(false, USER_NOT_LOGGED_IN, USER_LOGGED_IN_OBJECT(false))
      );
    }
    const document = await documentSchema.create({
      documentTitle,
      ownerUserId: new mongoObjectId(userId),
    });
    document.content = undefined;
    return res.json(
      GENERIC_MESSAGE(true, DOCUMENT_CREATED_SUCCESSFULY, {
        document: {
          documentTitle: document.documentTitle,
          documentId: document._id,
          createdAt: document.createdAt,
          updatedAt: document.updatedAt,
          ownerUserId: document.ownerUserId
        },
        ...USER_LOGGED_IN_OBJECT(true),
      })
    );
  } catch (err) {
    console.log(err);
    return res.json(GENERIC_MESSAGE(false, INTERNAL_ERROR_MESSAGE));
  }
});

documentRouter.post("/getAllDocuments", async(req, res) => {
  try{

    const token = req.headers.authtoken;
    const email = req.body.email;
    const userId = req.body.userId;
    if (!token) {
      return res.json(
        GENERIC_MESSAGE(false, TOKEN_NOT_PROVIDED, USER_LOGGED_IN_OBJECT(false))
      );
    }
    if (!email) {
      return res.json(GENERIC_MESSAGE(false, EMAIL_EMPTY_ERROR_MESSAGE));
    }
    if (!userId) {
      return res.json(GENERIC_MESSAGE(false, USER_ID_EMPTY_ERROR_MESSAGE));
    }
    if (!verify_user_with_token(token, userId, email)) {
      return res.json(
        GENERIC_MESSAGE(false, USER_NOT_LOGGED_IN, USER_LOGGED_IN_OBJECT(false))
      );
    }
    const document = await documentSchema.find({
      ownerUserId: new mongoObjectId(userId)
    });

    return res.json(
      GENERIC_MESSAGE(true, DOCUMENT_FOUND_SUCCESSFULY, {documents: document.map(d => ({
        documentTitle: d.documentTitle,
        documentId: d._id,
        createdAt: d.createdAt,
        updatedAt: d.updatedAt,
        ownerUserId: d.ownerUserId
      }))})
    );
  }
  catch(err){
    console.log(err);
    return res.json(
      GENERIC_MESSAGE(false, INTERNAL_ERROR_MESSAGE)
    );
  }
})

documentRouter.post("/get", (req, res) => {
  try{

    const token = req.headers.authtoken;
    const documentId = req.body.documentId;
    const email = req.body.email;
    const userId = req.body.useId;
    if (!token) {
      return res.json(
        GENERIC_MESSAGE(false, TOKEN_NOT_PROVIDED, USER_LOGGED_IN_OBJECT(false))
      );
    }
    if (!email) {
      return res.json(GENERIC_MESSAGE(false, EMAIL_EMPTY_ERROR_MESSAGE));
    }
    if (!documentId) {
      return res.json(
        GENERIC_MESSAGE(false, DOCUMENT_ID_EMPTY_ERROR_MESSAGE)
      );
    }
    if (!userId) {
      return res.json(GENERIC_MESSAGE(false, USER_ID_EMPTY_ERROR_MESSAGE));
    }
    if (!verify_user_with_token(token, userId, email)) {
      return res.json(
        GENERIC_MESSAGE(false, USER_NOT_LOGGED_IN, USER_LOGGED_IN_OBJECT(false))
      );
    }
    const document = documentSchema.findById(documentId);
    return res.json(
      GENERIC_MESSAGE(true, DOCUMENT_FOUND_SUCCESSFULY, {document})
    );
  }
  catch(err){
    console.log(err);
    return res.json(
      GENERIC_MESSAGE(false, INTERNAL_ERROR_MESSAGE)
    );
  }
});

documentRouter.post("/getContent/:documentId", async(req, res) => {
  try{

    const documentId = req.params.documentId;
    const token = req.headers.authtoken;
    const email = req.body.email;
    const userId = req.body.userId;
    if (!token) {
      return res.json(
        GENERIC_MESSAGE(false, TOKEN_NOT_PROVIDED, USER_LOGGED_IN_OBJECT(false))
      );
    }
    if (!email) {
      return res.json(GENERIC_MESSAGE(false, EMAIL_EMPTY_ERROR_MESSAGE));
    }
    if (!userId) {
      return res.json(GENERIC_MESSAGE(false, USER_ID_EMPTY_ERROR_MESSAGE));
    }
    if (!documentId) {
      return res.json(GENERIC_MESSAGE(false, DOCUMENT_ID_EMPTY_ERROR_MESSAGE));
    }
    if (!verify_user_with_token(token, userId, email)) {
      return res.json(
        GENERIC_MESSAGE(false, USER_NOT_LOGGED_IN, USER_LOGGED_IN_OBJECT(false))
      );
    }
    const document = await documentSchema.findById(documentId);
    if(document){
      return res.json(
        GENERIC_MESSAGE(true, DOCUMENT_FOUND_SUCCESSFULY, {
          documentId,
          content: document.content,
          loggedIn: true,
          documentTitle: document.documentTitle
        })
      )
    }
    else{
      return res.json(
        GENERIC_MESSAGE(false, INVALID_DOCUMENT)
      )
    }
  }
  catch(err){
    console.log(err);
    return res.json(GENERIC_MESSAGE(false, INTERNAL_ERROR_MESSAGE));
  }
})

documentRouter.post("/delete", async (req, res) => {
  try {
    const token = req.headers.authtoken;
    const userId = req.body.userId;
    const email = req.body.email;
    const documentId = req.body.documentId;
    if (!token) {
      return res.json(
        GENERIC_MESSAGE(false, TOKEN_NOT_PROVIDED, USER_LOGGED_IN_OBJECT(false))
      );
    }
    if (!email) {
      return res.json(GENERIC_MESSAGE(false, EMAIL_EMPTY_ERROR_MESSAGE));
    }
    if (!userId) {
      return res.json(GENERIC_MESSAGE(false, USER_ID_EMPTY_ERROR_MESSAGE));
    }
    if (!documentId) {
      return res.json(GENERIC_MESSAGE(false, DOCUMENT_ID_EMPTY_ERROR_MESSAGE));
    }
    if (!verify_user_with_token(token, userId, email)) {
      return res.json(
        GENERIC_MESSAGE(false, USER_NOT_LOGGED_IN, USER_LOGGED_IN_OBJECT(false))
      );
    }
    const document = await documentSchema.findById(documentId);
    if (!document) {
      return res.json(GENERIC_MESSAGE(false, INVALID_DOCUMENT));
    }
    if (document.ownerUserId != userId) {
      return res.json(
        GENERIC_MESSAGE(
          false,
          NOT_AUTHORISED_TO_DELETE_DOCUMENT,
          USER_LOGGED_IN_OBJECT(true)
        )
      );
    }
    await document.deleteOne();
    await sharedDocument.deleteMany({
      documentId: new mongoObjectId(documentId)
    });
    return res.json(
      GENERIC_MESSAGE(
        true,
        DOCUMENT_DELETED_SUCCESSFULY,
        USER_LOGGED_IN_OBJECT(true)
      )
    );
  } catch (err) {
    console.log(err)
    return res.json(GENERIC_MESSAGE(false, INTERNAL_ERROR_MESSAGE));
  }
});

documentRouter.post("/allSharedUserEmail", async(req, res) => {
  const documentId = req.body.documentId;
  const email = req.body.email;
  const userId = req.body.userId;
  const token = req.headers.authtoken;
  if (!token) {
    return res.json(
      GENERIC_MESSAGE(false, TOKEN_NOT_PROVIDED, USER_LOGGED_IN_OBJECT(false))
    );
  }
  if (!email) {
    return res.json(GENERIC_MESSAGE(false, EMAIL_EMPTY_ERROR_MESSAGE));
  }
  if (!userId) {
    return res.json(GENERIC_MESSAGE(false, USER_ID_EMPTY_ERROR_MESSAGE));
  }
  if (!documentId) {
    return res.json(GENERIC_MESSAGE(false, DOCUMENT_ID_EMPTY_ERROR_MESSAGE));
  }
  if (!verify_user_with_token(token, userId, email)) {
    return res.json(
      GENERIC_MESSAGE(false, USER_NOT_LOGGED_IN, USER_LOGGED_IN_OBJECT(false))
    );
  }
  const document = await documentSchema.findById(documentId);
  if(!document){
    return res.json(
      GENERIC_MESSAGE(false, DOCUMENT_NOT_FOUND)
    )
  }
  if(document.ownerUserId != userId){
    return res.json(GENERIC_MESSAGE(false, YOU_ARE_NOT_OWNER))
  }
  const allDoc = await sharedDocument.find({
    documentId: new mongoObjectId(documentId)
  });
  return res.json(GENERIC_MESSAGE(true, "", {
    allEmails: allDoc.map(doc => {
      return doc.sharedUserEmail
    })
  }))
})

documentRouter.post("/removeAccess", async(req, res) => {
  try{
    const token = req.headers.authtoken;
    const userId = req.body.userId;
    const email = req.body.email;
    const documentId = req.body.documentId;
    const sharedUserEmail = req.body.sharedUserEmail;
    if (!token) {
      return res.json(
        GENERIC_MESSAGE(false, TOKEN_NOT_PROVIDED, USER_LOGGED_IN_OBJECT(false))
      );
    }
    if (!email) {
      return res.json(GENERIC_MESSAGE(false, EMAIL_EMPTY_ERROR_MESSAGE));
    }
    if (!userId) {
      return res.json(GENERIC_MESSAGE(false, USER_ID_EMPTY_ERROR_MESSAGE));
    }
    if (!documentId) {
      return res.json(GENERIC_MESSAGE(false, DOCUMENT_ID_EMPTY_ERROR_MESSAGE));
    }
    if(!sharedUserEmail){
      return res.json(GENERIC_MESSAGE(false,SHARED_USER_EMAIL_EMPTY_ERROR_MESSAGE ));
    }
    if (!verify_user_with_token(token, userId, email)) {
      return res.json(
        GENERIC_MESSAGE(false, USER_NOT_LOGGED_IN, USER_LOGGED_IN_OBJECT(false))
      );
    }
    await sharedDocument.deleteMany({
      documentId: new mongoObjectId(documentId),
      sharedUserEmail
    });
    return res.json(
      GENERIC_MESSAGE(true, "")
    );
  }
  catch(err){
    return res.json(
      GENERIC_MESSAGE(true, INTERNAL_ERROR_MESSAGE)
    );
  }
})

documentRouter.post("/share", async(req, res) => {
  try{
    const token = req.headers.authtoken;
    const userId = req.body.userId;
    const email = req.body.email;
    const documentId = req.body.documentId;
    const sharedUserEmail = req.body.sharedUserEmail;
    const documentTitle = req.body.documentTitle;
    if (!token) {
      return res.json(
        GENERIC_MESSAGE(false, TOKEN_NOT_PROVIDED, USER_LOGGED_IN_OBJECT(false))
      );
    }
    if (!email) {
      return res.json(GENERIC_MESSAGE(false, EMAIL_EMPTY_ERROR_MESSAGE));
    }
    if (!userId) {
      return res.json(GENERIC_MESSAGE(false, USER_ID_EMPTY_ERROR_MESSAGE));
    }
    if (!documentId) {
      return res.json(GENERIC_MESSAGE(false, DOCUMENT_ID_EMPTY_ERROR_MESSAGE));
    }
    if(!sharedUserEmail){
      return res.json(GENERIC_MESSAGE(false,SHARED_USER_EMAIL_EMPTY_ERROR_MESSAGE ));
    }
    if(!documentTitle){
      return res.json(GENERIC_MESSAGE(false, DOCUMENT_TITLE_EMPTY_ERROR_MESSAGE));
    }
    if (!verify_user_with_token(token, userId, email)) {
      return res.json(
        GENERIC_MESSAGE(false, USER_NOT_LOGGED_IN, USER_LOGGED_IN_OBJECT(false))
      );
    }
    const user = await userSchema.find({
      email: sharedUserEmail
    });
    if(!user.length){
      return res.json(
        GENERIC_MESSAGE(false, EMAIL_NOT_FOUND)
      )
    }
    const document = await documentSchema.findById(documentId);
    if(document.ownerUserId != userId){
      return res.json(
        GENERIC_MESSAGE(false, YOU_ARE_NOT_OWNER)
      );
    }
    const doc = await sharedDocument.create({
      documentId: new mongoObjectId(documentId),
      sharedUserEmail,
      documentTitle,
      ownerUserId: new mongoObjectId(userId)
    });
    return res.json(GENERIC_MESSAGE(true, SHARED_DOCUMENT_CREATED));
  }
  catch(err){
    console.log(err)
    return res.json(GENERIC_MESSAGE(false, INTERNAL_ERROR_MESSAGE));
  }
})

documentRouter.post("/canAccess", async(req, res) => {
  try{
    const token = req.headers.authtoken;
    const userId = req.body.userId;
    const email = req.body.email;
    const documentId = req.body.documentId;
    if (!token) {
      return res.json(
        GENERIC_MESSAGE(false, TOKEN_NOT_PROVIDED, USER_LOGGED_IN_OBJECT(false))
      );
    }
    if (!email) {
      return res.json(GENERIC_MESSAGE(false, EMAIL_EMPTY_ERROR_MESSAGE));
    }
    if (!userId) {
      return res.json(GENERIC_MESSAGE(false, USER_ID_EMPTY_ERROR_MESSAGE));
    }
    if (!documentId) {
      return res.json(GENERIC_MESSAGE(false, DOCUMENT_ID_EMPTY_ERROR_MESSAGE));
    }
    if (!verify_user_with_token(token, userId, email)) {
      return res.json(
        GENERIC_MESSAGE(false, USER_NOT_LOGGED_IN, USER_LOGGED_IN_OBJECT(false))
      );
    }
    const doc = await documentSchema.findById(documentId);

    if(!doc){
      return res.json(GENERIC_MESSAGE(false, DOCUMENT_NOT_FOUND));
    }
    if(`${doc.ownerUserId}` == userId){
      return res.json(GENERIC_MESSAGE(true, ""));
    }
    const doc2 = await sharedDocument.find({
      documentId: new mongoObjectId(documentId),
      sharedUserEmail: email
    });
    if(doc2.length){
      return res.json(GENERIC_MESSAGE(true, ""));
    }
    return res.json(GENERIC_MESSAGE(false, ""));
  }
  catch(err){
    console.log(err);
    return res.json(GENERIC_MESSAGE(false, INTERNAL_ERROR_MESSAGE));
  }
})

documentRouter.post("/sharedDocuments", async(req, res) => {
  try{
    const token = req.headers.authtoken;
    const userId = req.body.userId;
    const email = req.body.email;
    if (!token) {
      return res.json(
        GENERIC_MESSAGE(false, TOKEN_NOT_PROVIDED, USER_LOGGED_IN_OBJECT(false))
      );
    }
    if (!email) {
      return res.json(GENERIC_MESSAGE(false, EMAIL_EMPTY_ERROR_MESSAGE));
    }
    if (!userId) {
      return res.json(GENERIC_MESSAGE(false, USER_ID_EMPTY_ERROR_MESSAGE));
    }
    if (!verify_user_with_token(token, userId, email)) {
      return res.json(
        GENERIC_MESSAGE(false, USER_NOT_LOGGED_IN, USER_LOGGED_IN_OBJECT(false))
      );
    }
    const response = await sharedDocument.find({
      sharedUserEmail: email
    });
    return res.json(
      GENERIC_MESSAGE(true, "", {
        documents: response.map(doc => ({
          documentId: doc.documentId,
          documentTitle: doc.documentTitle
        }))
      })
    )
  }
  catch(err){
    console.log(err);
    return res.json(GENERIC_MESSAGE(false, INTERNAL_ERROR_MESSAGE));
  }
})

module.exports = documentRouter;  