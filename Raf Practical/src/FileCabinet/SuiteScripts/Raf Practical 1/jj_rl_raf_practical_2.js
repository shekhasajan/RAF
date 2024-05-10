/**
 * @NApiVersion 2.1
 * @NScriptType Restlet
 */
define(['N/record', 'N/search', 'N/file', 'N/render', 'N/email','N/task'],
    /**
 * @param{record} record
 * @param{search} search
 */
    (record, search, file, render, email,task) => {
       

      

        /**
         * Defines the function that is executed when a POST request is sent to a RESTlet.
         * @param {string | Object} requestBody - The HTTP request body; request body is passed as a string when request
         *     Content-Type is 'text/plain' or parsed into an Object when request Content-Type is 'application/json' (in which case
         *     the body must be a valid JSON)
         * @returns {string | Object} HTTP response body; returns a string when request Content-Type is 'text/plain'; returns an
         *     Object when request Content-Type is 'application/json' or 'application/xml'
         * @since 2015.2
         */
       
        const post = (requestBody) => {
            log.debug()
            var folderName = requestBody.foldername;
            log.debug('folderName', folderName)
            var isFolderExist = checkforfolder(folderName);
            log.debug('isFolderExist', isFolderExist)

            var startDate = requestBody.startDate;
            log.debug('startDate', startDate);

            var email = requestBody.emailaddress;
            log.debug('email', email)


            var myTask = task.create({
                taskType: task.TaskType.MAP_REDUCE,
                scriptId: 'customscript_jj_mr_raf_asses_2',
                deploymentId: 'customdeploy_jj_mr_deploy_raf_assess_2',
                params: {  'custscript_jj_folder_name': folderName,
                    'custscript_jj_start_date': startDate,
                    'custscript_jj_email': email }
            });
    
        //     // Set parameters for the Map/Reduce script
            // myTask.params = {
            //     param1: folderName,
            //     param2: startDate,
            //     params3: email
            
            // };
    
        //     // Submit the Map/Reduce task
          var myTaskId = myTask.submit();
    
           log.debug('mrTaskId',myTaskId)

            if (isFolderExist) { // file not exist
                log.debug('no file', folderName);
                var foldId = createfolder(folderName); //create folder

                var customerSearchObj = search.create({
                    type: "customer",
                    filters:
                        [
                        ],
                    columns:
                        [
                            search.createColumn({ name: "entityid", label: "Name" }),
                            search.createColumn({ name: "email", label: "Email" })
                        ]
                });

    
                var searchResultCount = customerSearchObj.runPaged().count;

                log.debug("customerSearchObj result count", searchResultCount);
              
                customerSearchObj.run().each(function (result) {
                    // .run().each has a limit of 4,000 results
                    var cusId = parseInt(result.id);
                    log.debug("cusId", cusId)
                    var timeStamp = new Date().getUTCMilliseconds();
                    log.debug('timeStamp', timeStamp)
                    // var transactionFile = render.statement({
                    //     entityId: cusId,//Provide customer id for the statement
                    //     printMode: render.PrintMode.PDF,
                    //     startDate: startDate
                    // });

                    // log.debug('transactionFile', transactionFile)
                    // transactionFile.folder = foldId;
                    // let id = transactionFile.save();
                    // log.debug('id', id)
                    // var fileName = cusId + '_' + timeStamp;
                    // var fileObj = file.load({
                    //     id: id
                    // });
                    // fileObj.name = fileName;



                    // var fileId = fileObj.save();

                    // log.debug('id', fileId)

                    return true;
                });
              //  sendEmail(email);

                
            }
            else {
                log.debug('file', folderName);
                return (
                    "Folder exist"
                );
            }




        }

        function checkforfolder(folderName) {

            var folderSearchObj = search.create({
                type: "folder",
                filters:
                    [
                        ["name", "is", folderName]
                    ],
                columns:
                    [
                        search.createColumn({ name: "name", label: "Name" })
                    ]
            });
            var searchResultCount = folderSearchObj.runPaged().count;
            log.debug("folderSearchObj result count", searchResultCount);
            if (searchResultCount < 1) {
                return true;
            }

        }

        function createfolder(folderName) {
            log.debug('create')
            var folderRec = record.create({
                type: record.Type.FOLDER,
                isDynamic: true
            });

            folderRec.setValue({
                fieldId: 'name',
                value: folderName //Folder Name
            });
            var folderId = folderRec.save({
                enableSourcing: true,
                ignoreMandatoryFields: true
            });
            log.debug('folderIdd', folderId)
            return folderId;
        }

        function sendEmail(email) {
            log.debug('email')
            email.send({
                author: -5,
                recipients: email,
                subject: 'Customer Statemement!',
                body: 'Customer statements are stored in the file cabinet'
            })

        }

        /**
         * Defines the function that is executed when a DELETE request is sent to a RESTlet.
         * @param {Object} requestParams - Parameters from HTTP request URL; parameters are passed as an Object (for all supported
         *     content types)
         * @returns {string | Object} HTTP response body; returns a string when request Content-Type is 'text/plain'; returns an
         *     Object when request Content-Type is 'application/json' or 'application/xml'
         * @since 2015.2
         */


        return { post }

    });
