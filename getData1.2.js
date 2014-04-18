var cheerio=require('cheerio'),
    request=require('request'),
    S=require('string'),
    fs=require("fs");
    
var baseURL='http://shopping.indiatimes.com',
    pageLink='http://shopping.indiatimes.com/health-beauty/health-beauty-beauty-personal-care-men-s-grooming',
    startNumber=0,
    endNumber100,
    productLinks=[],
    queue = [],
    productData=[];
    
var getProductLinks=function(url){
  request({uri:url}, function (error, response, body) {
      if(response.statusCode==200){
          var $ = cheerio.load(body);
          $('.itemname').each(function(i,ele){
           productLinks.push(baseURL+ $(ele).attr('href'));
          });
      }
      productLinks.forEach(function(url){
          
          getProductDetails(url)
      });
      
    //  console.log(productLinks)
  })
  
};

var getProductDetails=function(url){
  request({uri:url}, function (error, response, body) {
     try{
      if(response.statusCode==200){
          var $ = cheerio.load(body);
          var details={}
          if($('.orgprice').html() !==null)
          details.price=S($('.orgprice').html()).collapseWhitespace().s;
          if($("p[itemprop='description']").html() !==null)
          details.desacription=S($("p[itemprop='description']").html()).stripTags().s.replace(/(\r\n\t|\n|\r|\t)/gm,"");
          if($("h1[itemprop='name']").html() !==null)
          details.title=S($("h1[itemprop='name']").html()).stripTags().s.replace(/(\r\n\t|\n|\r|\t)/gm,"");
          details.url=url;
      }
     }
     catch(err){
         console.log(url);
     }
      fs.appendFile('data.txt',JSON.stringify(details)+'\n', function (err) {
                        if (err) throw err;
             console.log('The "data to append" was appended to file!');
                });
      
 })
};



getProductLinks(pageLink);
