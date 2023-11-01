const db = require('../util/database');
const Product = require("../models/product");
exports.getPosts = ( req, res, next ) => {
         // Will send responds - dont need to render view
         // will return json reponse
         res.status(200).json({
             posts: [
                 { title: "All about nothing",
                   content: "Blah blah blah post 1"
                 },
                 { title: "What the hellllll",
                   content: "Blah blah blah post 1"
                 }
             ]
         });
}
exports.createPost = ( req, res, next) => {
    // expect input to be json data

    const title = req.body.title;
    console.log(`title:${title}`);
    const content = req.body.content;
    // Say 200 - success
    //     201 - successfully created
    res.status(201).json({
        message: "Post Create Successfully",
        post : { id : new Date().toISOString(),
                 title: title,
                 content: content
          }
    })

}
exports.getProducts = ( req, res, next ) => {
    // Will send responds - dont need to render view
    // will return json reponse
    Product.fetchAll()
        .then(( rows, fieldData ) => {
            console.log( "ROws="); console.log( rows );
            // let result = JSON.stringify(rows);
            let result = rows[0];
            // res.send( "Is seems ok ");
            res.status(200).json({
                    result
            })
            // res.render( 'admin/showProductsAdmin', {
            //     title: "Show Products Available (DB)",
            //     from: 'showProducts',
            //     products: rows[0]
            // })
        })
    // res.status(200).json({
    //     posts: [
    //         { title: "All about nothing",
    //             content: "Blah blah blah post 1"
    //         }
    //     ]
    // });
}

