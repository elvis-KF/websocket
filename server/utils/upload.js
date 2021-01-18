let fs = require('fs');
let path = require('path');
let moment = require('moment');
let multer = require('multer');

/**磁盘存储引擎，控制文件存储
 * destination：确定上传的文件应存储在哪个文件夹，不提供则是系统默认的临时文件夹
 * filename: 文件夹的文件名确定
 */
let storage = multer.diskStorage({
    destination: (req, file, cb)=>{
        let t = moment().format('YYYY-M-D');
        let disPath = `../uploads/${t}`;

        if(!fs.existsSync('../uploads')){
            fs.mkdirSync('../uploads');
        }

        if(!fs.existsSync(disPath)){
            fs.mkdirSync(disPath);
        }

        cb(null, disPath);
    },
    filename: (req, file, cb)=>{
        let ext = path.extname(file.originalname);
        cb(null, file.fieldname+'-'+Date.now() + ext);
    }
});

let upload = multer({ storage: storage});

module.exports = upload;
