var Q = require('q'),
    request=require('request'),
    S=require("string"),
    fs=require('fs');
var cheerio=require("cheerio")
var baseURL='http://shopping.indiatimes.com',
    pageLink='http://shopping.indiatimes.com/health-beauty/health-beauty-beauty-personal-care-men-s-grooming',
    startNumber=0,
    endNumber100,
    productLinks=[],
    queue = [],
    productData=[];

var getProductLinks=function(url){
    var deferred = Q.defer();
  request({uri:url}, function (error, response, body) {
      if(response.statusCode==200){
          var $ = cheerio.load(body);
          $('.itemname').each(function(i,ele){
             productLinks.push(baseURL+ $(ele).attr('href'));
          });
       deferred.resolve(productLinks);
      }
      else
      deferred.reject(error);
      
  });
  return deferred.promise;
};

var getProductDetails=function(url){
    var deferred = Q.defer();
  request({uri:url}, function (error, response, body) {
     
      if(response.statusCode==200){
          var $ = cheerio.load(body);
          var details={}
          details.price=S($('.orgprice').html()).collapseWhitespace().s;
          details.desacription=S($("p[itemprop='description']").html()).stripTags().s;
          details.title=S($("h1[itemprop='name']").html()).stripTags().s;
          details.url=url;
           setTimeout(deferred.resolve(details), 1000);
       
      }
      else
      deferred.reject(error);
      
  });
  return deferred.promise;
};

Q.fcall(getProductLinks(pageLink).then(function(val){
    val.forEach(function(url){
        Q.delay(1500);
       getProductDetails(url).then(function(detail){
          // console.log(detail);
           fs.appendFile('data.txt', JSON.stringify(detail)+'\n', function (err) {
                        if (err) throw err;
             console.log('The "data to append" was appended to file!');
                });
               
       }).catch(function(error){
           console.log(error)
       })
       
    });
   
})).catch(function (error) {
    // Handle any error from all above steps
})
.done();
