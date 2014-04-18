var cheerio=require('cheerio'),
    request=require('request'),
    S=require('string'),
    fs=require("fs");
    
var baseURL='http://www.cromaretail.com/',
    pageLink='http://www.cromaretail.com/Air-Conditioners-c-46.aspx',
    startNumber=0,
    endNumber100,
    productLinks=[],
    queue = [],
    productData=[];
    
var getProductLinks=function(url){
  request({uri:url}, function (error, response, body) {
      if(response.statusCode==200){
          var $ = cheerio.load(body);
          $('article').each(function(i,ele){
              
           productLinks.push(baseURL+ $($(ele).find('a')[0]).attr('href'));
          });
      }
      productLinks.forEach(function(url){
          console.log(url);
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
          if($('.cta h2').text() !==null)
          details.price=S($('.cta h2').text()).collapseWhitespace().s;
       //   if($("p[itemprop='description']").html() !==null)
       //   details.desacription=S($("p[itemprop='description']").html()).stripTags().s.replace(/(\r\n\t|\n|\r|\t)/gm,"");
          if($(".pDesc h1").html() !==null)
          details.title=S($(".pDesc h1").html()).stripTags().s.replace(/(\r\n\t|\n|\r|\t)/gm,"");
          if( $('.productImage img'))
          details.image=baseURL+ $('.productImage img').attr('src');
          
          details.url=url;
      }
     }
     catch(err){
         console.log(url);
     }
      fs.appendFile('croma.txt',JSON.stringify(details)+'\n', function (err) {
                        if (err) throw err;
             console.log('The "data to append" was appended to file!');
                });
      
 })
};



getProductLinks(pageLink);
