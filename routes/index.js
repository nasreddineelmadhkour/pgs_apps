var express = require('express');
var router = express.Router();
require('dotenv').config(); // Load environment variables from .env file
const sql = require("msnodesqlv8");
const connectionString = process.env.DB_CONNECTION;



sql.open(connectionString, function (err, conn) {
  if (err) {
    console.log('Error connecting to database:', err);
    return;
  }
  console.log('Connected to database.');
});



















/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'PGS TUNISIE' });
});

// ***************************       SUPPLIER         ******************************************


router.get('/addsupplier', function(req, res) {
  res.render('addsupplier', { title: 'add supplier' });
});

router.post("/addsupplier", async function(req, res, next) {
  try {
    const { SUPPLIER_NUMBER, NAME, ADDRESS_1, ADDRESS_2, ADDRESS_3, ADDRESS_4, SHIPPING_PHONE } = req.body;

    const query = `INSERT INTO dbo.supplier (SUPPLIER_NUMBER, NAME, ADDRESS_1, ADDRESS_2, ADDRESS_3, ADDRESS_4, SHIPPING_PHONE) VALUES ('${SUPPLIER_NUMBER}', '${NAME}', '${ADDRESS_1}', '${ADDRESS_2}', '${ADDRESS_3}', '${ADDRESS_4}', '${SHIPPING_PHONE}')`;


    const pool = await sql.query(connectionString, query, async (err, result) => {


      if (err) {
        console.log(err);
        res.status(500).json({error: "Internal server error"});
        return;
      }

      try {
        const query = 'SELECT * FROM dbo.supplier WHERE IS_DROPED=0;';
        const pool = await sql.query(connectionString, query, async (err, rows) => {


          if (err) {
            console.log(err);
            res.status(500).json({error: "Internal server error"});
            return;
          }
          res.render('showSupplier', {title: 'Terminal Supplier', action: 'list', sampleData: rows})
          //console.log(rows);
        });
      } catch (err) {
        next(err);
      }

      console.log(result);
    });
  } catch (err) {
    next(err);
  }
});

router.post("/editsupplierSubmit", async function(req, res) {
  try {
    const { SUPPLIER_NUMBER, NAME, ADDRESS_1, ADDRESS_2, ADDRESS_3, ADDRESS_4, SHIPPING_PHONE } = req.body;

    const query =
        `UPDATE [dbo].[SUPPLIER] SET [NAME] = '${NAME}',[ADDRESS_1] = '${ADDRESS_1}',[ADDRESS_2] = '${ADDRESS_2}',[ADDRESS_3] = '${ADDRESS_3}',[ADDRESS_4] = '${ADDRESS_4}'
      ,[SHIPPING_PHONE] = '${SHIPPING_PHONE}' WHERE SUPPLIER_NUMBER = ${SUPPLIER_NUMBER} `;
    const pool = await sql.query(connectionString, query, async (err, rows) => {


      const query = 'SELECT * FROM dbo.supplier WHERE IS_DROPED=0;';
      const pool = await sql.query(connectionString, query, async (err, rows) => {


        if (err) {
          console.log(err);
          res.status(500).json({error: "Internal server error"});
          return;
        }
        res.render('showSupplier', {title: 'Terminal Supplier', action: 'list', sampleData: rows})
      });





    });
  } catch (err) {
    next(err);
  }
});

router.post('/editsupplier', async function (req, res) {

  try {
    const {SUPPLIER_NUMBER} = req.body;

    const query = `SELECT * FROM dbo.supplier WHERE SUPPLIER_NUMBER = ${SUPPLIER_NUMBER}`;
    const pool = await sql.query(connectionString, query, async (err, rows) => {

      if (err) {
        console.log(err);
        res.status(500).json({error: "Internal server error"});
        return;
      }


      res.render('editsupplier',{title:'Edit supplier',action:'list', sampleData:rows})
      //console.log(rows);


    });
  } catch (err) {
    next(err);
  }



});

router.post("/deletesupplier", async function(req, res) {
  try {
    const {SUPPLIER_NUMBER} = req.body;
    const query = `UPDATE dbo.SUPPLIER SET IS_DROPED=1 WHERE SUPPLIER_NUMBER =${SUPPLIER_NUMBER}`;
    const pool = await sql.query(connectionString, query, async (err, result) => {



      const query = 'SELECT * FROM dbo.supplier WHERE IS_DROPED=0;';
      const pool = await sql.query(connectionString, query, async (err, rows) => {
        res.render('showSupplier', {title: 'List suppliers', action: 'list', sampleData: rows})

      });


    });}
  catch (err) {
    next(err);
  }
});

router.get("/getsupplier", async function(req, res, next) {
  try {
    const query = 'SELECT * FROM dbo.supplier WHERE IS_DROPED=0; ';
    const pool = await sql.query(connectionString, query, async (err, rows) => {
      if (err) {
        console.log(err);
        res.status(500).json({error: "Internal server error"});
        return;
      }
      res.render('showSupplier',{title:'List suppliers',action:'list', sampleData:rows})
      //console.log(rows);
    });
  } catch (err) {
    next(err);
  }
});




// ***************************       CUSTOMER         ******************************************



router.get("/addcustomer", async function(req, res, next) {
  try {
    const query = 'SELECT * FROM dbo.supplier WHERE IS_DROPED=0; ';
    const pool = await sql.query(connectionString, query, async (err, rows) => {
      if (err) {
        console.log(err);
        res.status(500).json({error: "Internal server error"});
        return;
      }
      res.render('addcustomer',{title:'ADD CUSTOMER',action:'list', sampleData:rows})
      //console.log(rows);
    });
  } catch (err) {
    next(err);
  }
});
router.post("/addcustomer", async function(req, res, next) {
  try {
    const { CUSTOMER_NUMBER, NAME, ADDRESS_1, ADDRESS_2, ADDRESS_3, ADDRESS_4, SHIPPING_PHONE,SUPPLIER_NUMBER } = req.body;

    const query = `INSERT INTO dbo.customer (CUSTOMER_NUMBER, NAME, ADDRESS_1, ADDRESS_2, ADDRESS_3, ADDRESS_4, SHIPPING_PHONE,SUPPLIER_NUMBER_FK) VALUES ('${CUSTOMER_NUMBER}', '${NAME}', '${ADDRESS_1}', '${ADDRESS_2}', '${ADDRESS_3}', '${ADDRESS_4}', '${SHIPPING_PHONE}',${SUPPLIER_NUMBER})`;


    const pool = await sql.query(connectionString, query, async (err, result) => {


      if (err) {
        console.log(err);
        res.status(500).json({error: "Internal server error"});
        return;
      }

      const query = 'SELECT [CUSTOMER_NUMBER]\n' +
          '      ,dbo.CUSTOMER.NAME,\n' +
          '\t  dbo.CUSTOMER.ADDRESS_1,\n' +
          '\t  dbo.CUSTOMER.ADDRESS_2,\n' +
          '\t  dbo.CUSTOMER.ADDRESS_3,\n' +
          '\t  dbo.CUSTOMER.ADDRESS_4,\n' +
          '\t  dbo.CUSTOMER.SHIPPING_PHONE,\n' +
          '\n' +
          '\t  dbo.CUSTOMER.SUPPLIER_NUMBER_FK as SUPPLIER_NUMBER,\n' +
          '      dbo.SUPPLIER.NAME as NAME_SUPPLIER\n' +
          '  FROM [dbo].[CUSTOMER] , [dbo].[SUPPLIER]\n' +
          '  WHERE dbo.SUPPLIER.SUPPLIER_NUMBER=dbo.CUSTOMER.SUPPLIER_NUMBER_FK AND dbo.customer.IS_DROPED=0';
      const pool = await sql.query(connectionString, query, async (err, rows) => {
        res.render('showcustomer', {title: 'List customer', action: 'list', sampleData: rows})

      });
    });
  } catch (err) {
    next(err);
  }
});

router.post('/editcustomer', async function (req, res) {

  try {
    const {CUSTOMER_NUMBER} = req.body;

    const query = "SELECT [CUSTOMER_NUMBER]\n" +
        "      ,dbo.CUSTOMER.NAME,\n" +
        "\t  dbo.CUSTOMER.ADDRESS_1,\n" +
        "\t  dbo.CUSTOMER.ADDRESS_2,\n" +
        "\t  dbo.CUSTOMER.ADDRESS_3,\n" +
        "\t  dbo.CUSTOMER.ADDRESS_4,\n" +
        "\t  dbo.CUSTOMER.SHIPPING_PHONE,\n" +
        "\n" +
        "\t  dbo.CUSTOMER.SUPPLIER_NUMBER_FK as SUPPLIER_NUMBER,\n" +
        "      dbo.SUPPLIER.NAME as NAME_SUPPLIER\n" +
        "  FROM [dbo].[CUSTOMER] , [dbo].[SUPPLIER]\n" +
        `  WHERE dbo.SUPPLIER.SUPPLIER_NUMBER=dbo.CUSTOMER.SUPPLIER_NUMBER_FK AND dbo.customer.IS_DROPED=0 AND CUSTOMER_NUMBER='${CUSTOMER_NUMBER}'`;
    const pool = await sql.query(connectionString, query, async (err, rows) => {

      if (err) {
        console.log(err);
        res.status(500).json({error: "Internal server error"});
        return;
      }


      res.render('editcustomer',{title:'Edit customer',action:'list', sampleData:rows})
      //console.log(rows);


    });
  } catch (err) {
    next(err);
  }



});
router.post("/editcustomerSubmit", async function(req, res) {
  try {
    const { CUSTOMER_NUMBER, NAME, ADDRESS_1, ADDRESS_2, ADDRESS_3, ADDRESS_4, SHIPPING_PHONE } = req.body;

    const query =
        `UPDATE [dbo].[CUSTOMER] SET [NAME] = '${NAME}',[ADDRESS_1] = '${ADDRESS_1}',[ADDRESS_2] = '${ADDRESS_2}',[ADDRESS_3] = '${ADDRESS_3}',[ADDRESS_4] = '${ADDRESS_4}'
      ,[SHIPPING_PHONE] = '${SHIPPING_PHONE}' WHERE CUSTOMER_NUMBER = '${CUSTOMER_NUMBER}' `;
    const pool = await sql.query(connectionString, query, async (err, rows) => {




      const query = 'SELECT [CUSTOMER_NUMBER]\n' +
          '      ,dbo.CUSTOMER.NAME,\n' +
          '\t  dbo.CUSTOMER.ADDRESS_1,\n' +
          '\t  dbo.CUSTOMER.ADDRESS_2,\n' +
          '\t  dbo.CUSTOMER.ADDRESS_3,\n' +
          '\t  dbo.CUSTOMER.ADDRESS_4,\n' +
          '\t  dbo.CUSTOMER.SHIPPING_PHONE,\n' +
          '\n' +
          '\t  dbo.CUSTOMER.SUPPLIER_NUMBER_FK as SUPPLIER_NUMBER,\n' +
          '      dbo.SUPPLIER.NAME as NAME_SUPPLIER\n' +
          '  FROM [dbo].[CUSTOMER] , [dbo].[SUPPLIER]\n' +
          '  WHERE dbo.SUPPLIER.SUPPLIER_NUMBER=dbo.CUSTOMER.SUPPLIER_NUMBER_FK AND dbo.customer.IS_DROPED=0';
      const pool = await sql.query(connectionString, query, async (err, rows) => {
        res.render('showcustomer', {title: 'List customer', action: 'list', sampleData: rows})





      });
    })
  } catch (err) {
    next(err);
  }
});

router.post("/deletecustomer", async function(req, res) {
  try {
    const {CUSTOMER_NUMBER} = req.body;
    const query = `UPDATE dbo.customer SET IS_DROPED=1 WHERE CUSTOMER_NUMBER =${CUSTOMER_NUMBER}`;
    const pool = await sql.query(connectionString, query, async (err, result) => {



      const query = 'SELECT [CUSTOMER_NUMBER]\n' +
          '      ,dbo.CUSTOMER.NAME,\n' +
          '\t  dbo.CUSTOMER.ADDRESS_1,\n' +
          '\t  dbo.CUSTOMER.ADDRESS_2,\n' +
          '\t  dbo.CUSTOMER.ADDRESS_3,\n' +
          '\t  dbo.CUSTOMER.ADDRESS_4,\n' +
          '\t  dbo.CUSTOMER.SHIPPING_PHONE,\n' +
          '\n' +
          '\t  dbo.CUSTOMER.SUPPLIER_NUMBER_FK as SUPPLIER_NUMBER,\n' +
          '      dbo.SUPPLIER.NAME as NAME_SUPPLIER\n' +
          '  FROM [dbo].[CUSTOMER] , [dbo].[SUPPLIER]\n' +
          '  WHERE dbo.SUPPLIER.SUPPLIER_NUMBER=dbo.CUSTOMER.SUPPLIER_NUMBER_FK AND dbo.customer.IS_DROPED=0';
      const pool = await sql.query(connectionString, query, async (err, rows) => {
        res.render('showcustomer', {title: 'List customer', action: 'list', sampleData: rows})

      });


    });}
  catch (err) {
    next(err);
  }
});

router.get("/getcustomer", async function(req, res, next) {
  try {
    const query = 'SELECT [CUSTOMER_NUMBER]\n' +
        '      ,dbo.CUSTOMER.NAME,\n' +
        '\t  dbo.CUSTOMER.ADDRESS_1,\n' +
        '\t  dbo.CUSTOMER.ADDRESS_2,\n' +
        '\t  dbo.CUSTOMER.ADDRESS_3,\n' +
        '\t  dbo.CUSTOMER.ADDRESS_4,\n' +
        '\t  dbo.CUSTOMER.SHIPPING_PHONE,\n' +
        '\n' +
        '\t  dbo.CUSTOMER.SUPPLIER_NUMBER_FK as SUPPLIER_NUMBER,\n' +
        '      dbo.SUPPLIER.NAME as NAME_SUPPLIER\n' +
        '  FROM [dbo].[CUSTOMER] , [dbo].[SUPPLIER]\n' +
        '  WHERE dbo.SUPPLIER.SUPPLIER_NUMBER=dbo.CUSTOMER.SUPPLIER_NUMBER_FK AND dbo.customer.IS_DROPED=0';


    const pool = await sql.query(connectionString, query, async (err, rows) => {
      if (err) {
        console.log(err);
        res.status(500).json({error: "Internal server error"});
        return;
      }
      res.render('showcustomer',{title:'List customer',action:'list', sampleData:rows})
      //console.log(rows);
    });
  } catch (err) {
    next(err);
  }
});





// ***************************       DESTINATION         ******************************************



router.get("/addDestination", async function(req, res, next) {
  try {
    const query = 'SELECT * FROM dbo.supplier WHERE IS_DROPED=0; ';
    const pool = await sql.query(connectionString, query, async (err, rows) => {

      const query = 'SELECT * FROM dbo.customer WHERE IS_DROPED=0; ';
      const pool = await sql.query(connectionString, query, async (err, rows2) => {

        res.render('addDestination',{title:'ADD DESTINATION',action:'list',sampleData:rows, sampleData2:rows2})

      });

    });
  } catch (err) {
    next(err);
  }
});
router.post("/addDestination", async function(req, res, next) {
  try {
    const { DESTINATION_NUMBER, NAME, ADDRESS_1, ADDRESS_2, ADDRESS_3, ADDRESS_4,SUPPLIER_NUMBER ,CUSTOMER_NUMBER} = req.body;
    const query = `INSERT INTO dbo.destination (DESTINATION_NUMBER, NAME, ADDRESS_1, ADDRESS_2, ADDRESS_3, ADDRESS_4, SUPPLIER_NUMBER_FK,CUSTOMER_NUMBER_FK) VALUES (${DESTINATION_NUMBER}, '${NAME}', '${ADDRESS_1}', '${ADDRESS_2}', '${ADDRESS_3}', '${ADDRESS_4}', ${SUPPLIER_NUMBER},'${CUSTOMER_NUMBER}')`;
    const pool = await sql.query(connectionString, query, async (err, result) => {


      if (err) {
        console.log(err);
        res.status(500).json({error: "Internal server error"});
        return;
      }

      const query = 'SELECT DESTINATION_NUMBER\n' +
          '    ,dbo.DESTINATION.NAME\n' +
          '    ,dbo.DESTINATION.ADDRESS_1\n' +
          '    ,dbo.DESTINATION.ADDRESS_2\n' +
          '    ,dbo.DESTINATION.ADDRESS_3\n' +
          '    ,dbo.DESTINATION.ADDRESS_4\n' +
          '    ,dbo.DESTINATION.SUPPLIER_NUMBER_FK AS SUPPLIER_NUMBER\n' +
          '    ,dbo.DESTINATION.CUSTOMER_NUMBER_FK AS CUSTOMER_NUMBER,\n' +
          '    dbo.SUPPLIER.NAME as SUPPLIER_NAME,\n' +
          '    dbo.CUSTOMER.NAME as CUSTOMER_NAME\n' +
          'FROM dbo.DESTINATION,dbo.CUSTOMER,dbo.SUPPLIER\n' +
          'WHERE dbo.CUSTOMER.CUSTOMER_NUMBER=dbo.DESTINATION.CUSTOMER_NUMBER_FK AND dbo.DESTINATION.SUPPLIER_NUMBER_FK=dbo.SUPPLIER.SUPPLIER_NUMBER AND dbo.DESTINATION.IS_DROPED=0 ; ';


      const pool = await sql.query(connectionString, query, async (err, rows) => {
        if (err) {
          console.log(err);
          res.status(500).json({error: "Internal server error"});
          return;
        }
        res.render('showdestination',{title:'LIST DESTINATION',action:'list', sampleData:rows})

      });
    });
  } catch (err) {
    next(err);
  }
});
router.post('/editdestination', async function (req, res) {

  try {
    const {DESTINATION_NUMBER} = req.body;

    const query = `SELECT [DESTINATION_NUMBER],[dbo].[DESTINATION].[NAME],[dbo].[DESTINATION].[ADDRESS_1],[dbo].[DESTINATION].[ADDRESS_2],[dbo].[DESTINATION].[ADDRESS_3],[dbo].[DESTINATION].[ADDRESS_4],[dbo].[DESTINATION].[SUPPLIER_NUMBER_FK] AS SUPPLIER_NUMBER,dbo.SUPPLIER.NAME as SUPPLIER_NAME,[dbo].[DESTINATION].[CUSTOMER_NUMBER_FK] AS CUSTOMER_NUMBER,dbo.CUSTOMER.NAME as CUSTOMER_NAME FROM [dbo].[DESTINATION],dbo.SUPPLIER,dbo.CUSTOMER WHERE dbo.DESTINATION.CUSTOMER_NUMBER_FK=dbo.CUSTOMER.CUSTOMER_NUMBER AND dbo.DESTINATION.SUPPLIER_NUMBER_FK=dbo.SUPPLIER.SUPPLIER_NUMBER AND dbo.DESTINATION.DESTINATION_NUMBER=${DESTINATION_NUMBER}`;
    const pool = await sql.query(connectionString, query, async (err, rows) => {



      if (err) {
        console.log(err);
        res.status(500).json({error: "Internal server error"});
        return;
      }


      res.render('editdestination',{title:'EDIT DISTINATION',action:'list', sampleData:rows})
      //console.log(rows);


    });
  } catch (err) {
    next(err);
  }



});

router.post("/editdestinationSubmit", async function(req, res) {
  try {
    const { DESTINATION_NUMBER, NAME, ADDRESS_1, ADDRESS_2, ADDRESS_3, ADDRESS_4 } = req.body;

    const query =
        `UPDATE [dbo].[destination] SET [NAME] = '${NAME}',[ADDRESS_1] = '${ADDRESS_1}',[ADDRESS_2] = '${ADDRESS_2}',[ADDRESS_3] = '${ADDRESS_3}',[ADDRESS_4] = '${ADDRESS_4}'
       WHERE DESTINATION_NUMBER = ${DESTINATION_NUMBER} `;
    const pool = await sql.query(connectionString, query, async (err, rows) => {



      const query = 'SELECT DESTINATION_NUMBER\n' +
          '    ,dbo.DESTINATION.NAME\n' +
          '    ,dbo.DESTINATION.ADDRESS_1\n' +
          '    ,dbo.DESTINATION.ADDRESS_2\n' +
          '    ,dbo.DESTINATION.ADDRESS_3\n' +
          '    ,dbo.DESTINATION.ADDRESS_4\n' +
          '    ,dbo.DESTINATION.SUPPLIER_NUMBER_FK AS SUPPLIER_NUMBER\n' +
          '    ,dbo.DESTINATION.CUSTOMER_NUMBER_FK AS CUSTOMER_NUMBER,\n' +
          '    dbo.SUPPLIER.NAME as SUPPLIER_NAME,\n' +
          '    dbo.CUSTOMER.NAME as CUSTOMER_NAME\n' +
          'FROM dbo.DESTINATION,dbo.CUSTOMER,dbo.SUPPLIER\n' +
          'WHERE dbo.CUSTOMER.CUSTOMER_NUMBER=dbo.DESTINATION.CUSTOMER_NUMBER_FK AND dbo.DESTINATION.SUPPLIER_NUMBER_FK=dbo.SUPPLIER.SUPPLIER_NUMBER AND dbo.DESTINATION.IS_DROPED=0 ; ';


      const pool = await sql.query(connectionString, query, async (err, rows) => {
        if (err) {
          console.log(err);
          res.status(500).json({error: "Internal server error"});
          return;
        }
        res.render('showdestination',{title:'LIST DESTINATION',action:'list', sampleData:rows})

      });


    })
  } catch (err) {
    next(err);
  }
});

router.post("/deletedestination", async function(req, res) {
  try {
    const {DESTINATION_NUMBER} = req.body;
    const query = `UPDATE dbo.destination SET IS_DROPED=1 WHERE DESTINATION_NUMBER =${DESTINATION_NUMBER}`;
    const pool = await sql.query(connectionString, query, async (err, result) => {



      const query = 'SELECT DESTINATION_NUMBER\n' +
          '    ,dbo.DESTINATION.NAME\n' +
          '    ,dbo.DESTINATION.ADDRESS_1\n' +
          '    ,dbo.DESTINATION.ADDRESS_2\n' +
          '    ,dbo.DESTINATION.ADDRESS_3\n' +
          '    ,dbo.DESTINATION.ADDRESS_4\n' +
          '    ,dbo.DESTINATION.SUPPLIER_NUMBER_FK AS SUPPLIER_NUMBER\n' +
          '    ,dbo.DESTINATION.CUSTOMER_NUMBER_FK AS CUSTOMER_NUMBER,\n' +
          '    dbo.SUPPLIER.NAME as SUPPLIER_NAME,\n' +
          '    dbo.CUSTOMER.NAME as CUSTOMER_NAME\n' +
          'FROM dbo.DESTINATION,dbo.CUSTOMER,dbo.SUPPLIER\n' +
          'WHERE dbo.CUSTOMER.CUSTOMER_NUMBER=dbo.DESTINATION.CUSTOMER_NUMBER_FK AND dbo.DESTINATION.SUPPLIER_NUMBER_FK=dbo.SUPPLIER.SUPPLIER_NUMBER AND dbo.DESTINATION.IS_DROPED=0 ; ';


      const pool = await sql.query(connectionString, query, async (err, rows) => {
        if (err) {
          console.log(err);
          res.status(500).json({error: "Internal server error"});
          return;
        }
        res.render('showdestination',{title:'LIST DESTINATION',action:'list', sampleData:rows})

      });


    });}
  catch (err) {
    next(err);
  }
});
router.get("/getdestination", async function(req, res, next) {
  try {
    const query = 'SELECT DESTINATION_NUMBER\n' +
        '    ,dbo.DESTINATION.NAME\n' +
        '    ,dbo.DESTINATION.ADDRESS_1\n' +
        '    ,dbo.DESTINATION.ADDRESS_2\n' +
        '    ,dbo.DESTINATION.ADDRESS_3\n' +
        '    ,dbo.DESTINATION.ADDRESS_4\n' +
        '    ,dbo.DESTINATION.SUPPLIER_NUMBER_FK AS SUPPLIER_NUMBER\n' +
        '    ,dbo.DESTINATION.CUSTOMER_NUMBER_FK AS CUSTOMER_NUMBER,\n' +
        '    dbo.SUPPLIER.NAME as SUPPLIER_NAME,\n' +
        '    dbo.CUSTOMER.NAME as CUSTOMER_NAME\n' +
        'FROM dbo.DESTINATION,dbo.CUSTOMER,dbo.SUPPLIER\n' +
        'WHERE dbo.CUSTOMER.CUSTOMER_NUMBER=dbo.DESTINATION.CUSTOMER_NUMBER_FK AND dbo.DESTINATION.SUPPLIER_NUMBER_FK=dbo.SUPPLIER.SUPPLIER_NUMBER AND dbo.DESTINATION.IS_DROPED=0 ; ';


    const pool = await sql.query(connectionString, query, async (err, rows) => {
      if (err) {
        console.log(err);
        res.status(500).json({error: "Internal server error"});
        return;
      }
      res.render('showdestination',{title:'LIST DESTINATION',action:'list', sampleData:rows})

    });
  } catch (err) {
    next(err);
  }
});



// ***************************       CARRIER         ******************************************


router.get('/addcarrier', function(req, res) {
  res.render('addcarrier', { title: 'ADD CARRIER' });
});

router.post("/addcarrier", async function(req, res, next) {
  try {
    const { CARRIER_NUMBER, NAME, SCAC_CODE} = req.body;

    const query = `INSERT INTO dbo.carrier (CARRIER_NUMBER, NAME, SCAC_CODE) VALUES (${CARRIER_NUMBER}, '${NAME}', '${SCAC_CODE}')`;


    const pool = await sql.query(connectionString, query, async (err, result) => {


      if (err) {
        console.log(err);
        res.status(500).json({error: "Internal server error"});
        return;
      }

      try {
        const query = 'SELECT * FROM dbo.carrier WHERE IS_DROPED=0;';
        const pool = await sql.query(connectionString, query, async (err, rows) => {


          if (err) {
            console.log(err);
            res.status(500).json({error: "Internal server error"});
            return;
          }
          res.render('showcarrier', {title: 'LIST CARRIER', action: 'list', sampleData: rows})
          //console.log(rows);
        });
      } catch (err) {
        next(err);
      }

      console.log(result);
    });
  } catch (err) {
    next(err);
  }
});
router.post("/editcarrierSubmit", async function(req, res) {
  try {
    const { CARRIER_NUMBER, NAME, SCAC_CODE} = req.body;

    const query =
        `UPDATE [dbo].[CARRIER] SET [NAME] = '${NAME}',[SCAC_CODE] = '${SCAC_CODE}' WHERE CARRIER_NUMBER = ${CARRIER_NUMBER} `;
    const pool = await sql.query(connectionString, query, async (err, rows) => {


      const query = 'SELECT * FROM dbo.carrier WHERE IS_DROPED=0;';
      const pool = await sql.query(connectionString, query, async (err, rows) => {


        if (err) {
          console.log(err);
          res.status(500).json({error: "Internal server error"});
          return;
        }
        res.render('showcarrier', {title: 'LIST CARRIER', action: 'list', sampleData: rows})
      });





    });
  } catch (err) {
    next(err);
  }
});

router.post('/editcarrier', async function (req, res) {

  try {
    const {CARRIER_NUMBER} = req.body;

    const query = `SELECT * FROM dbo.carrier WHERE CARRIER_NUMBER = ${CARRIER_NUMBER}`;
    const pool = await sql.query(connectionString, query, async (err, rows) => {

      if (err) {
        console.log(err);
        res.status(500).json({error: "Internal server error"});
        return;
      }


      res.render('editcarrier',{title:'EDIT CARRIER',action:'list', sampleData:rows})
      //console.log(rows);


    });
  } catch (err) {
    next(err);
  }



});

router.get("/getcarrier", async function(req, res, next) {
  try {
    const query = 'SELECT * FROM dbo.carrier WHERE IS_DROPED=0; ';
    const pool = await sql.query(connectionString, query, async (err, rows) => {
      if (err) {
        console.log(err);
        res.status(500).json({error: "Internal server error"});
        return;
      }
      res.render('showcarrier',{title:'LIST CARRIERS',action:'list', sampleData:rows})
      //console.log(rows);
    });
  } catch (err) {
    next(err);
  }
});

router.post("/deletecarrier", async function(req, res) {
  try {
    const {CARRIER_NUMBER} = req.body;
    const query = `UPDATE dbo.carrier SET IS_DROPED=1 WHERE CARRIER_NUMBER =${CARRIER_NUMBER}`;
    const pool = await sql.query(connectionString, query, async (err, result) => {



      const query = 'SELECT * FROM dbo.carrier WHERE IS_DROPED=0;';
      const pool = await sql.query(connectionString, query, async (err, rows) => {
        res.render('showcarrier',{title:'LIST CARRIERS',action:'list', sampleData:rows})

      });


    });}
  catch (err) {
    next(err);
  }
});







// ***************************       SUPPLIER_CARRIER         ******************************************


router.get("/affectcarriertosupplier", async function(req, res, next) {
  try {
    const query = 'SELECT * FROM dbo.supplier WHERE IS_DROPED=0; ';
    const pool = await sql.query(connectionString, query, async (err, rows) => {

      const query = 'SELECT * FROM dbo.carrier WHERE IS_DROPED=0; ';
      const pool = await sql.query(connectionString, query, async (err, rows2) => {

        res.render('affectCarriertoSupplier',{title:'AFFECT CARRIER TO SUPPLIER',action:'list',sampleData:rows, sampleData2:rows2})

      });

    });
  } catch (err) {
    next(err);
  }
});
router.post("/affectcarriertosupplier", async function(req, res, next) {
  try {
    const { SUPPLIER_NUMBER,CARRIER_NUMBER, HOST_CARRIER, ENABLED, LIMIT_DESTINATIONS, LIMIT_CUSTOMERS } = req.body;
    if(ENABLED)
      IS_ENABLED=1;
    else  IS_ENABLED=0;
    if(LIMIT_DESTINATIONS)
        IS_LIMIT_DESTINATIONS=1;
      else
        IS_LIMIT_DESTINATIONS=0;

      if(LIMIT_CUSTOMERS)
        IS_LIMIT_CUSTOMERS=1;
      else
        IS_LIMIT_CUSTOMERS=0;


    const query = `INSERT INTO dbo.supplier_carrier (CARRIER_NUMBER, SUPPLIER_NUMBER, HOST_CARRIER, ENABLED, LIMIT_DESTINATIONS, LIMIT_CUSTOMERS) VALUES (${CARRIER_NUMBER}, ${SUPPLIER_NUMBER}, ${HOST_CARRIER}, ${IS_ENABLED}, ${IS_LIMIT_DESTINATIONS}, ${IS_LIMIT_CUSTOMERS})`;
    const pool = await sql.query(connectionString, query, async (err, result) => {


      if (err) {
        console.log(err);
        res.status(500).json({error: "Internal server error"});
        return;
      }

      const query = 'SELECT [ID],[HOST_CARRIER],[ENABLED],[LIMIT_CUSTOMERS],[LIMIT_DESTINATIONS],sc.CARRIER_NUMBER, c.NAME as CARRIER_NAME,sc.SUPPLIER_NUMBER, s.NAME as SUPPLIER_NAME FROM [dbo].[SUPPLIER_CARRIER] sc,dbo.CARRIER c,dbo.SUPPLIER s where c.CARRIER_NUMBER = sc.CARRIER_NUMBER AND s.SUPPLIER_NUMBER= sc.SUPPLIER_NUMBER AND sc.IS_DROPED=0\n';
      const pool = await sql.query(connectionString, query, async (err, rows) => {
        res.render('showSupplierCarrier', {title: 'LIST SUPPLIER CARRIER', action: 'list', sampleData: rows})

      });
    });
  } catch (err) {
    next(err);
  }
});
router.get("/getsuppliercarrier", async function(req, res, next) {
  try {
    const query = 'SELECT [ID],[HOST_CARRIER],[ENABLED],[LIMIT_CUSTOMERS],[LIMIT_DESTINATIONS],sc.CARRIER_NUMBER, c.NAME as CARRIER_NAME,sc.SUPPLIER_NUMBER, s.NAME as SUPPLIER_NAME FROM [dbo].[SUPPLIER_CARRIER] sc,dbo.CARRIER c,dbo.SUPPLIER s where c.CARRIER_NUMBER = sc.CARRIER_NUMBER AND s.SUPPLIER_NUMBER= sc.SUPPLIER_NUMBER AND sc.IS_DROPED=0\n';


    const pool = await sql.query(connectionString, query, async (err, rows) => {
      if (err) {
        console.log(err);
        res.status(500).json({error: "Internal server error"});
        return;
      }
      res.render('showSupplierCarrier',{title:'LIST SUPPLIER CARRIER',action:'list', sampleData:rows})
      //console.log(rows);
    });
  } catch (err) {
    next(err);
  }
});
router.post("/deletesuppliercarrier", async function(req, res) {
  try {
    const {ID} = req.body;
    const query = `UPDATE dbo.supplier_carrier SET IS_DROPED=1 WHERE ID =${ID}`;
    const pool = await sql.query(connectionString, query, async (err, result) => {



      const query = 'SELECT [ID],[HOST_CARRIER],[ENABLED],[LIMIT_CUSTOMERS],[LIMIT_DESTINATIONS],sc.CARRIER_NUMBER, c.NAME as CARRIER_NAME,sc.SUPPLIER_NUMBER, s.NAME as SUPPLIER_NAME FROM [dbo].[SUPPLIER_CARRIER] sc,dbo.CARRIER c,dbo.SUPPLIER s where c.CARRIER_NUMBER = sc.CARRIER_NUMBER AND s.SUPPLIER_NUMBER= sc.SUPPLIER_NUMBER AND sc.IS_DROPED=0\n';


      const pool = await sql.query(connectionString, query, async (err, rows) => {
        if (err) {
          console.log(err);
          res.status(500).json({error: "Internal server error"});
          return;
        }
        res.render('showSupplierCarrier',{title:'LIST SUPPLIER CARRIER',action:'list', sampleData:rows})
        //console.log(rows);
      });







    });}
  catch (err) {
    next(err);
  }
});




// ***************************       DRIVER         ******************************************

router.get("/adddriver", async function(req, res, next) {
  try {
    const query = 'SELECT * FROM dbo.carrier WHERE IS_DROPED=0; ';
    const pool = await sql.query(connectionString, query, async (err, rows) => {
      if (err) {
        console.log(err);
        res.status(500).json({error: "Internal server error"});
        return;
      }
      res.render('adddriver',{title:'ADD DRIVER',action:'list', sampleData:rows})
      //console.log(rows);
    });
  } catch (err) {
    next(err);
  }
});

router.post("/adddriver", async function(req, res, next) {
  try {
    const { DRIVER_NUMBER, NAME, INITIAL, LICENSE_NUMBER, CARRIER_NUMBER} = req.body;

    const query = `INSERT INTO dbo.driver (DRIVER_NUMBER, NAME, INITIAL, LICENSE_NUMBER, CARRIER_NUMBER) VALUES (${DRIVER_NUMBER}, '${NAME}', '${INITIAL}', '${LICENSE_NUMBER}', ${CARRIER_NUMBER})`;


    const pool = await sql.query(connectionString, query, async (err, result) => {


      if (err) {
        console.log(err);
        res.status(500).json({error: "Internal server error"});
        return;
      }

      const query = 'SELECT [DRIVER_NUMBER],d.NAME,[INITIAL],[LICENSE_NUMBER],d.CARRIER_NUMBER,c.NAME as CARRIER_NAME FROM dbo.DRIVER d , dbo.CARRIER c WHERE c.CARRIER_NUMBER=d.CARRIER_NUMBER AND d.IS_DROPED=0';
      const pool = await sql.query(connectionString, query, async (err, rows) => {
        res.render('showdriver', {title: 'LIST DRIVERS', action: 'list', sampleData: rows})

      });
    });
  } catch (err) {
    next(err);
  }
});

router.post('/editdriver', async function (req, res) {

  try {
    const {DRIVER_NUMBER} = req.body;

    const query = `SELECT [DRIVER_NUMBER],d.[NAME],[INITIAL],[LICENSE_NUMBER],d.[CARRIER_NUMBER],c.[NAME] as CARRIER_NAME FROM [dbo].[DRIVER] d, dbo.CARRIER c where d.CARRIER_NUMBER=c.CARRIER_NUMBER AND DRIVER_NUMBER=${DRIVER_NUMBER};`;
    const pool = await sql.query(connectionString, query, async (err, rows) => {

      if (err) {
        console.log(err);
        res.status(500).json({error: "Internal server error"});
        return;
      }


      res.render('editdriver',{title:'EDIT DRIVER',action:'list', sampleData:rows})
      //console.log(rows);


    });
  } catch (err) {
    next(err);
  }



});
router.post("/editdriverSubmit", async function(req, res) {
  try {
    const { DRIVER_NUMBER, NAME, INITIAL, LICENSE_NUMBER } = req.body;

    const query = `UPDATE [dbo].[DRIVER] SET [NAME] = '${NAME}',[INITIAL] = '${INITIAL}',[LICENSE_NUMBER] = '${LICENSE_NUMBER}' WHERE DRIVER_NUMBER =${DRIVER_NUMBER} `;
    const pool = await sql.query(connectionString, query, async (err, rows) => {




      const query = `SELECT [DRIVER_NUMBER],d.NAME,[INITIAL],[LICENSE_NUMBER],d.CARRIER_NUMBER,c.NAME as CARRIER_NAME FROM dbo.DRIVER d , dbo.CARRIER c WHERE c.CARRIER_NUMBER=d.CARRIER_NUMBER AND d.IS_DROPED=0`;
      const pool = await sql.query(connectionString, query, async (err, rows) => {
        res.render('showdriver', {title: 'LIST DRIVERS', action: 'list', sampleData: rows})

      });
    })
  } catch (err) {
    next(err);
  }
});

router.post("/deletedriver", async function(req, res) {
  try {
    const {DRIVER_NUMBER} = req.body;
    const query = `UPDATE dbo.driver SET IS_DROPED=1 WHERE DRIVER_NUMBER =${DRIVER_NUMBER}`;
    const pool = await sql.query(connectionString, query, async (err, result) => {



      const query = 'SELECT [DRIVER_NUMBER],d.NAME,[INITIAL],[LICENSE_NUMBER],d.CARRIER_NUMBER,c.NAME as CARRIER_NAME FROM dbo.DRIVER d , dbo.CARRIER c WHERE c.CARRIER_NUMBER=d.CARRIER_NUMBER AND d.IS_DROPED=0';
      const pool = await sql.query(connectionString, query, async (err, rows) => {
        res.render('showdriver', {title: 'LIST DRIVERS', action: 'list', sampleData: rows})

      });
    });}
  catch (err) {
    next(err);
  }
});

router.get("/getdriver", async function(req, res, next) {
  try {

    const query = 'SELECT [DRIVER_NUMBER],d.NAME,[INITIAL],[LICENSE_NUMBER],d.CARRIER_NUMBER,c.NAME as CARRIER_NAME FROM dbo.DRIVER d , dbo.CARRIER c WHERE c.CARRIER_NUMBER=d.CARRIER_NUMBER AND d.IS_DROPED=0';
    const pool = await sql.query(connectionString, query, async (err, rows) => {
      res.render('showdriver', {title: 'LIST DRIVERS', action: 'list', sampleData: rows})

    });
  } catch (err) {
    next(err);
  }
});


// ***************************       TRACTOR         ******************************************
router.get("/addtractor", async function(req, res, next) {
  try {
    const query = 'SELECT * FROM dbo.carrier WHERE IS_DROPED=0; ';
    const pool = await sql.query(connectionString, query, async (err, rows) => {
      if (err) {
        console.log(err);
        res.status(500).json({error: "Internal server error"});
        return;
      }
      res.render('addtractor',{title:'ADD TRACTOR',action:'list', sampleData:rows})
      //console.log(rows);
    });
  } catch (err) {
    next(err);
  }
});
router.post("/addtractor", async function(req, res, next) {
  try {
    const { TRACTOR_NUMBER, SERIAL_NUMBER, LICENSE_NUMBER, STATE, CARRIER_NUMBER} = req.body;

    const query = `INSERT INTO dbo.tractor (TRACTOR_NUMBER, SERIAL_NUMBER, LICENSE_NUMBER, STATE, CARRIER_NUMBER) VALUES (${TRACTOR_NUMBER}, '${SERIAL_NUMBER}', '${LICENSE_NUMBER}', '${STATE}', ${CARRIER_NUMBER})`;


    const pool = await sql.query(connectionString, query, async (err, result) => {


      if (err) {
        console.log(err);
        res.status(500).json({error: "Internal server error"});
        return;
      }

      const query = 'SELECT [TRACTOR_NUMBER],[SERIAL_NUMBER],[LICENSE_NUMBER],[STATE],t.CARRIER_NUMBER,c.NAME as CARRIER_NAME FROM [dbo].[TRACTOR] t , dbo.CARRIER c  where c.CARRIER_NUMBER=t.CARRIER_NUMBER AND t.IS_DROPED=0';
      const pool = await sql.query(connectionString, query, async (err, rows) => {
        res.render('showtractor', {title: 'LIST TRACTORS', action: 'list', sampleData: rows})

      });
    });
  } catch (err) {
    next(err);
  }
});
router.post("/deletetractor", async function(req, res) {
  try {
    const {TRACTOR_NUMBER} = req.body;
    const query = `UPDATE dbo.tractor SET IS_DROPED=1 WHERE TRACTOR_NUMBER =${TRACTOR_NUMBER}`;
    const pool = await sql.query(connectionString, query, async (err, result) => {



      const query = 'SELECT [TRACTOR_NUMBER],[SERIAL_NUMBER],[LICENSE_NUMBER],[STATE],t.CARRIER_NUMBER,c.NAME as CARRIER_NAME FROM [dbo].[TRACTOR] t , dbo.CARRIER c  where c.CARRIER_NUMBER=t.CARRIER_NUMBER AND t.IS_DROPED=0';
      const pool = await sql.query(connectionString, query, async (err, rows) => {
        res.render('showtractor', {title: 'LIST TRACTORS', action: 'list', sampleData: rows})

      });
    });}
  catch (err) {
    next(err);
  }
});
router.post('/edittractor', async function (req, res) {

  try {
    const {TRACTOR_NUMBER} = req.body;

    const query = "SELECT [TRACTOR_NUMBER],SERIAL_NUMBER,STATE, LICENSE_NUMBER,t.CARRIER_NUMBER,c.NAME as CARRIER_NAME\n" +
        `  FROM [dbo].[TRACTOR] t, [dbo].[CARRIER] c WHERE t.CARRIER_NUMBER=c.CARRIER_NUMBER AND t.IS_DROPED=0 AND TRACTOR_NUMBER=${TRACTOR_NUMBER}`;
    const pool = await sql.query(connectionString, query, async (err, rows) => {

      if (err) {
        console.log(err);
        res.status(500).json({error: "Internal server error"});
        return;
      }


      res.render('edittractor',{title:'EDIT TRACTOR',action:'list', sampleData:rows})


    });
  } catch (err) {
    next(err);
  }



});
router.post("/edittractorSubmit", async function(req, res) {
  try {
    const { TRACTOR_NUMBER, SERIAL_NUMBER, STATE, LICENSE_NUMBER } = req.body;

    const query =
        `UPDATE [dbo].[tractor] SET [SERIAL_NUMBER] = '${SERIAL_NUMBER}',[STATE] = '${STATE}',[LICENSE_NUMBER] = '${LICENSE_NUMBER}' WHERE TRACTOR_NUMBER = ${TRACTOR_NUMBER} `;
    const pool = await sql.query(connectionString, query, async (err, rows) => {




      const query = 'SELECT [TRACTOR_NUMBER],[SERIAL_NUMBER],[LICENSE_NUMBER],[STATE],t.CARRIER_NUMBER,c.NAME as CARRIER_NAME FROM [dbo].[TRACTOR] t , dbo.CARRIER c  where c.CARRIER_NUMBER=t.CARRIER_NUMBER AND t.IS_DROPED=0';
      const pool = await sql.query(connectionString, query, async (err, rows) => {
        res.render('showtractor', {title: 'LIST TRACTORS', action: 'list', sampleData: rows})

      });
    })
  } catch (err) {
    next(err);
  }
});
router.get("/gettractor", async function(req, res, next) {
  try {

    const query = 'SELECT [TRACTOR_NUMBER],[SERIAL_NUMBER],[LICENSE_NUMBER],[STATE],t.CARRIER_NUMBER,c.NAME as CARRIER_NAME FROM [dbo].[TRACTOR] t , dbo.CARRIER c  where c.CARRIER_NUMBER=t.CARRIER_NUMBER AND t.IS_DROPED=0';
    const pool = await sql.query(connectionString, query, async (err, rows) => {
      res.render('showtractor', {title: 'LIST TRACTORS', action: 'list', sampleData: rows})

    });
  } catch (err) {
    next(err);
  }
});

// ***************************       TRAILER         ******************************************
router.get("/addtrailer", async function(req, res, next) {
  try {
    const query = 'SELECT * FROM dbo.carrier WHERE IS_DROPED=0; ';
    const pool = await sql.query(connectionString, query, async (err, rows) => {
      if (err) {
        console.log(err);
        res.status(500).json({error: "Internal server error"});
        return;
      }
      res.render('addtrailer',{title:'ADD TRAILER',action:'list', sampleData:rows})
      //console.log(rows);
    });
  } catch (err) {
    next(err);
  }
});
router.post("/addtrailer", async function(req, res, next) {
  try {
    const { TRAILER_CODE, SERIAL_NUMBER, LICENSE_NUMBER, STATE, CARRIER_NUMBER, LOADING_TYPE, USABLE_CAPACITY} = req.body;

    const query = `INSERT INTO dbo.trailer (TRAILER_CODE, SERIAL_NUMBER, LICENSE_NUMBER, STATE,LOADING_TYPE,USABLE_CAPACITY, CARRIER_NUMBER) VALUES ('${TRAILER_CODE}', '${SERIAL_NUMBER}', '${LICENSE_NUMBER}', '${STATE}', '${LOADING_TYPE}', ${USABLE_CAPACITY}, ${CARRIER_NUMBER})`;


    const pool = await sql.query(connectionString, query, async (err, result) => {


      if (err) {
        console.log(err);
        res.status(500).json({error: "Internal server error"});
        return;
      }

      const query = 'SELECT [TRAILER_CODE],[SERIAL_NUMBER],[LICENSE_NUMBER],[STATE],[LOADING_TYPE],[USABLE_CAPACITY],t.CARRIER_NUMBER,c.NAME as CARRIER_NAME FROM dbo.TRAILER t, dbo.CARRIER c where c.CARRIER_NUMBER=t.CARRIER_NUMBER AND t.IS_DROPED=0';
      const pool = await sql.query(connectionString, query, async (err, rows) => {
        res.render('showtrailer', {title: 'LIST TRAILERS', action: 'list', sampleData: rows})

      });
    });
  } catch (err) {
    next(err);
  }
});
router.get("/gettrailer", async function(req, res, next) {
  try {

    const query = 'SELECT [TRAILER_CODE],[SERIAL_NUMBER],[LICENSE_NUMBER],[STATE],[LOADING_TYPE],[USABLE_CAPACITY],t.CARRIER_NUMBER,c.NAME as CARRIER_NAME FROM dbo.TRAILER t, dbo.CARRIER c where c.CARRIER_NUMBER=t.CARRIER_NUMBER AND t.IS_DROPED=0';
    const pool = await sql.query(connectionString, query, async (err, rows) => {
      res.render('showtrailer', {title: 'LIST TRAILERS', action: 'list', sampleData: rows})

    });
  } catch (err) {
    next(err);
  }
});
router.post("/deletetrailer", async function(req, res) {
  try {
    const {TRAILER_CODE} = req.body;
    const query = `UPDATE dbo.trailer SET IS_DROPED=1 WHERE TRAILER_CODE ='${TRAILER_CODE}'`;
    const pool = await sql.query(connectionString, query, async (err, result) => {



      const query = 'SELECT [TRAILER_CODE],[SERIAL_NUMBER],[LICENSE_NUMBER],[STATE],[LOADING_TYPE],[USABLE_CAPACITY],t.CARRIER_NUMBER,c.NAME as CARRIER_NAME FROM dbo.TRAILER t, dbo.CARRIER c where c.CARRIER_NUMBER=t.CARRIER_NUMBER AND t.IS_DROPED=0';
      const pool = await sql.query(connectionString, query, async (err, rows) => {
        res.render('showtrailer', {title: 'LIST TRAILERS', action: 'list', sampleData: rows})

      });
    });}
  catch (err) {
    next(err);
  }
});

router.post("/addtrailer", async function(req, res, next) {
  try {
    const { TRAILER_CODE, SERIAL_NUMBER, LICENSE_NUMBER, STATE, CARRIER_NUMBER, LOADING_TYPE, USABLE_CAPACITY} = req.body;

    const query = `INSERT INTO dbo.trailer (TRAILER_CODE, SERIAL_NUMBER, LICENSE_NUMBER, STATE,LOADING_TYPE,USABLE_CAPACITY, CARRIER_NUMBER) VALUES ('${TRAILER_CODE}', '${SERIAL_NUMBER}', '${LICENSE_NUMBER}', '${STATE}', '${LOADING_TYPE}', ${USABLE_CAPACITY}, ${CARRIER_NUMBER})`;


    const pool = await sql.query(connectionString, query, async (err, result) => {


      if (err) {
        console.log(err);
        res.status(500).json({error: "Internal server error"});
        return;
      }

      const query = 'SELECT [TRAILER_CODE],[SERIAL_NUMBER],[LICENSE_NUMBER],[STATE],[LOADING_TYPE],[USABLE_CAPACITY],t.CARRIER_NUMBER,c.NAME as CARRIER_NAME FROM dbo.TRAILER t, dbo.CARRIER c where c.CARRIER_NUMBER=t.CARRIER_NUMBER AND t.IS_DROPED=0';
      const pool = await sql.query(connectionString, query, async (err, rows) => {
        res.render('showtrailer', {title: 'LIST TRAILERS', action: 'list', sampleData: rows})

      });
    });
  } catch (err) {
    next(err);
  }
});

router.post('/edittrailer', async function (req, res) {

  try {
    const {TRAILER_CODE} = req.body;

    const query = `SELECT [TRAILER_CODE],[SERIAL_NUMBER],[LICENSE_NUMBER],[STATE],[LOADING_TYPE],[USABLE_CAPACITY],t.[CARRIER_NUMBER],c.[NAME] as CARRIER_NAME FROM [dbo].[TRAILER] t, dbo.CARRIER c where t.CARRIER_NUMBER=c.CARRIER_NUMBER AND TRAILER_CODE='${TRAILER_CODE}'
`;
    const pool = await sql.query(connectionString, query, async (err, rows) => {

      if (err) {
        console.log(err);
        res.status(500).json({error: "Internal server error"});
        return;
      }


      res.render('edittrailer',{title:'EDIT TRAILER',action:'list', sampleData:rows})
      //console.log(rows);


    });
  } catch (err) {
    next(err);
  }



});
router.post("/edittrailerSubmit", async function(req, res) {
  try {
    const { TRAILER_CODE, SERIAL_NUMBER, LICENSE_NUMBER, STATE, LOADING_TYPE, USABLE_CAPACITY} = req.body;
    const query =`UPDATE [dbo].[trailer] SET [SERIAL_NUMBER] = '${SERIAL_NUMBER}',[STATE] = '${STATE}',[LICENSE_NUMBER] = '${LICENSE_NUMBER}' , USABLE_CAPACITY=${USABLE_CAPACITY},LOADING_TYPE='${LOADING_TYPE}' WHERE TRAILER_CODE = '${TRAILER_CODE}' `;
    const pool = await sql.query(connectionString, query, async (err, rows) => {




      const query = 'SELECT [TRAILER_CODE],[SERIAL_NUMBER],[LICENSE_NUMBER],[STATE],[LOADING_TYPE],[USABLE_CAPACITY],t.CARRIER_NUMBER,c.NAME as CARRIER_NAME FROM dbo.TRAILER t, dbo.CARRIER c where c.CARRIER_NUMBER=t.CARRIER_NUMBER AND t.IS_DROPED=0';
      const pool = await sql.query(connectionString, query, async (err, rows) => {
        res.render('showtrailer', {title: 'LIST TRAILERS', action: 'list', sampleData: rows})

      });
    })
  } catch (err) {
    next(err);
  }
});



// ***************************       VEHICULE         ******************************************
router.get("/addvehicule", async function(req, res, next) {
  try {
    const { CARRIER_NUMBER,key2} = req.body;

    const query = 'SELECT * FROM dbo.carrier WHERE IS_DROPED=0;  ';
    const pool = await sql.query(connectionString, query, async (err, rows) => {

      const query2 = ` SELECT [TRACTOR_NUMBER] ,[SERIAL_NUMBER],[LICENSE_NUMBER],[STATE],[CARRIER_NUMBER],[IS_DROPED] FROM [dbo].[TRACTOR] WHERE  IS_DROPED=0 AND [CARRIER_NUMBER]='${rows[0].CARRIER_NUMBER}' ;`;
      const pool = await sql.query(connectionString, query2, async (err, rows2) => {
        console.log(CARRIER_NUMBER);
        res.render('addvehicule',{title:'ADD VEHICULE',action:'list',sampleData:rows, sampleData2:rows2,CARRIER_NUMBER:rows[0].CARRIER_NUMBER})

      });

    });
  } catch (err) {
    next(err);
  }

});

router.post("/addvehiculebycarrier", async function(req, res, next) {
  try {
    const { CARRIER_NUMBER,key2} = req.body;

    const query = 'SELECT * FROM dbo.carrier WHERE IS_DROPED=0;  ';
    const pool = await sql.query(connectionString, query, async (err, rows) => {

      const query2 = ` SELECT [TRACTOR_NUMBER] ,[SERIAL_NUMBER],[LICENSE_NUMBER],[STATE],[CARRIER_NUMBER],[IS_DROPED] FROM [dbo].[TRACTOR] WHERE  IS_DROPED=0 AND [CARRIER_NUMBER]='${CARRIER_NUMBER}' ;`;
      const pool = await sql.query(connectionString, query2, async (err, rows2) => {
      console.log(CARRIER_NUMBER);
        res.render('addvehicule',{title:'ADD VEHICULE',action:'list',sampleData:rows, sampleData2:rows2,CARRIER_NUMBER:CARRIER_NUMBER})

      });

    });
  } catch (err) {
    next(err);
  }

});
router.post("/gettrailerbycarrier", async function(req, res, next) {
  try {
    const { CARRIER_NUMBER, key2 } = req.body;
    const query = `SELECT [TRAILER_CODE],[SERIAL_NUMBER],[LICENSE_NUMBER],[STATE],[LOADING_TYPE],[USABLE_CAPACITY],[CARRIER_NUMBER],[IS_DROPED] FROM [dbo].[TRAILER]  WHERE  IS_DROPED=0 AND [CARRIER_NUMBER]='${CARRIER_NUMBER}' ;`;
    const pool = await sql.query(connectionString, query, async (err, rows) => {
      if (err) {
        throw err;
      }
      console.log(rows);
      res.json(rows); // Retourner les données JSON

    });
  } catch (err) {
    next(err);
  }
});


router.post("/savevehicule", async function(req, res, next) {
  try {
    const formData = req.body;
    const { CARRIER_NUMBER, TRACTOR_NUMBER , VEHICULE_CODE,VEHICULE_DESCRIPTION } = req.body;

    let qry="";
    for (const variableName in formData) {
      if (variableName.startsWith('comboName') && /^\d/.test(variableName[9])) {
        const variableValue = formData[variableName];
        const character = variableName[9];
        let position = 'PositionName' + character;
        //console.log(variableValue,formData[position]);
        qry = qry + `INSERT INTO [dbo].[VEHICULE_TRAILER] ([VEHICULE_CODE],[TRAILER_CODE],[POSITION]) VALUES ('${VEHICULE_CODE}','${variableValue}',${formData[position]}) ; `;
      }
    }
      const query = `INSERT INTO [dbo].[VEHICULE] ([VEHICULE_CODE],[VEHICULE_DESCRIPTION],[CARRIER_NUMBER],[TRACTOR_NUMBER]) VALUES ('${VEHICULE_CODE}','${VEHICULE_DESCRIPTION}',${CARRIER_NUMBER},${TRACTOR_NUMBER}) ; `+qry;

      const pool = await sql.query(connectionString, query, async (err, result) => {
        if (err) {
          console.log(err);
          res.status(500).json({error: "Internal server error"});
          return;
        }
    });

    try {
      setTimeout(async function () {
        const query = `SELECT VEHICULE_CODE,VEHICULE_DESCRIPTION,v.[CARRIER_NUMBER],c.NAME as CARRIER_NAME,v.TRACTOR_NUMBER,t.SERIAL_NUMBER as SERIAL_NUMBER FROM VEHICULE v,CARRIER c,TRACTOR t where v.CARRIER_NUMBER=c.CARRIER_NUMBER and v.TRACTOR_NUMBER=t.TRACTOR_NUMBER and v.IS_DROPED=0 ;`;
        const pool = await sql.query(connectionString, query, async (err, rows) => {

          const query2 = `SELECT [VEHICULE_CODE],[TRAILER_CODE] ,[POSITION] FROM [dbo].[VEHICULE_TRAILER]`;
          const pool2 = await sql.query(connectionString, query2, async (err, rows2) => {
            res.render('showvehicule', {title: 'LIST VEHICULE', action: 'list', sampleData: rows, sampleData2: rows2})

          });

        });

      }, 1000);


    } catch (err) {
      next(err);
    }

  } catch (err) {
    next(err);
  }

});


router.get("/getvehicule", async function(req, res, next) {
  try {

    const query = `SELECT VEHICULE_CODE,VEHICULE_DESCRIPTION,v.[CARRIER_NUMBER],c.NAME as CARRIER_NAME,v.TRACTOR_NUMBER,t.SERIAL_NUMBER as SERIAL_NUMBER FROM VEHICULE v,CARRIER c,TRACTOR t where v.CARRIER_NUMBER=c.CARRIER_NUMBER and v.TRACTOR_NUMBER=t.TRACTOR_NUMBER and v.IS_DROPED=0 ;`;
    const pool = await sql.query(connectionString, query, async (err, rows) => {

      const query2 = `SELECT [VEHICULE_CODE],[TRAILER_CODE] ,[POSITION] FROM [dbo].[VEHICULE_TRAILER]`;
      const pool2 = await sql.query(connectionString, query2, async (err, rows2) => {
        res.render('showvehicule', {title: 'LIST VEHICULE', action: 'list', sampleData: rows,sampleData2:rows2})

      });

    });
  } catch (err) {
    next(err);
  }
});


router.post("/deletevehicule", async function(req, res) {
  try {
    const {VEHICULE_CODE} = req.body;
    const query = `UPDATE dbo.vehicule SET IS_DROPED=1 WHERE VEHICULE_CODE ='${VEHICULE_CODE}'`;
    const pool = await sql.query(connectionString, query, async (err, result) => {



      try {

        const query = `SELECT VEHICULE_CODE,VEHICULE_DESCRIPTION,v.[CARRIER_NUMBER],c.NAME as CARRIER_NAME,v.TRACTOR_NUMBER,t.SERIAL_NUMBER as SERIAL_NUMBER FROM VEHICULE v,CARRIER c,TRACTOR t where v.CARRIER_NUMBER=c.CARRIER_NUMBER and v.TRACTOR_NUMBER=t.TRACTOR_NUMBER and v.IS_DROPED=0 ;`;
        const pool = await sql.query(connectionString, query, async (err, rows) => {

          const query2 = `SELECT [VEHICULE_CODE],[TRAILER_CODE] ,[POSITION] FROM [dbo].[VEHICULE_TRAILER]`;
          const pool2 = await sql.query(connectionString, query2, async (err, rows2) => {
            res.render('showvehicule', {title: 'LIST VEHICULE', action: 'list', sampleData: rows,sampleData2:rows2})

          });

        });
      } catch (err) {
        next(err);
      }

    });
  }
  catch (err) {
    next(err);
  }
});









module.exports = router;
