/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/record', 'N/ui/serverWidget', 'N/http', 'N/url'],
    /**
 * @param{record} record
 * @param{serverWidget} serverWidget
 */
    (record, serverWidget, http, url) => {
        /**
         * Defines the Suitelet script trigger point.
         * @param {Object} scriptContext
         * @param {ServerRequest} scriptContext.request - Incoming request
         * @param {ServerResponse} scriptContext.response - Suitelet response
         * @since 2015.2
         */
        const onRequest = (scriptContext) => {
            var sublist;
            if (scriptContext.request.method === 'GET') {
                try {
                    log.debug('test')

                    // var headerObj = {
                    //     'Content-Type': 'application/json',
                    // 'Accept': 'application/json'
                    // };
                    var response = http.get({
                        url: 'http://universities.hipolabs.com/search?country=japan'

                    });
                    log.debug('response', response)


                    populateForm(response);
                    // scriptContext.response.writePage(form);
                } catch (e) {
                    log.debug('err get', e)
                }
            }
            else if (scriptContext.request.method === 'POST') {


                log.debug('test')
                var selCountry = scriptContext.request.parameters.custpage_jj_filter_country;


                log.debug('selCountry', selCountry)
                if (selCountry == 'China') {
                    var response = http.get({
                        url: 'http://universities.hipolabs.com/search?country=china'

                    });


                    log.debug('response', response)
                    // populateForm(sublist, response);
                    // log.debug('sublist', sublist)
                }
                if (selCountry == 'India') {

                    var response = http.get({
                        url: 'http://universities.hipolabs.com/search?country=India'

                    });


                    log.debug('response', response)
                    // populateForm(sublist, response);
                    // log.debug('sublist', sublist)
                }
                if (selCountry == 'Japan') {
                    var response = http.get({
                        url: 'http://universities.hipolabs.com/search?country=Japan'

                    });


                    log.debug('response', response)
                    // populateForm(sublist, response);
                    // log.debug('sublist', sublist)
                }

                populateForm(response, selCountry);
                log.debug('sublist', sublist)


            }
            function populateForm(response, selCountry) {


                var universityDetails = JSON.parse(response.body);
                var arrLength = universityDetails.length;
                log.debug('arrLength', arrLength)

                var form = serverWidget.createForm({
                    title: 'University List'
                });
                var countryList = form.addField({
                    id: 'custpage_jj_filter_country',
                    type: serverWidget.FieldType.SELECT,
                    label: 'Country',
                })

                countryList.addSelectOption({
                    value: 'Japan',
                    text: 'Japan'
                });
                countryList.addSelectOption({
                    value: 'China',
                    text: 'China'
                });
                countryList.addSelectOption({
                    value: 'India',
                    text: 'India'
                });

                sublist = form.addSublist({
                    id: 'custpage_jj_sublist',
                    type: serverWidget.SublistType.INLINEEDITOR,
                    label: 'University details'
                });
                sublist.addField({
                    id: 'custpage_jj_country',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Country'
                });
                sublist.addField({
                    id: 'custpage_jj_name',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Name'
                });
                sublist.addField({
                    id: 'custpage_jj_state',
                    type: serverWidget.FieldType.TEXT,
                    label: 'State/Province'
                });
                sublist.addField({
                    id: 'custpage_jj_webpage',
                    type: serverWidget.FieldType.URL,
                    label: 'Web Pages'
                });
                form.addSubmitButton({
                    label: 'Submit'
                });
                countryList.defaultValue = 'Japan';
                if (selCountry == 'India') {
                    countryList.defaultValue = 'India';
                }
                if (selCountry == 'China') {
                    countryList.defaultValue = 'China';
                }




                for (var i = 0; i < arrLength; i++) {

                    sublist.setSublistValue({
                        id: 'custpage_jj_country',
                        line: i,
                        value: universityDetails[i].country
                    });
                    sublist.setSublistValue({
                        id: 'custpage_jj_name',
                        line: i,
                        value: universityDetails[i].name
                    });
                    sublist.setSublistValue({
                        id: 'custpage_jj_state',
                        line: i,
                        value: universityDetails[i]['state-province']
                    });
                    sublist.setSublistValue({
                        id: 'custpage_jj_webpage',
                        line: i,
                        value: universityDetails[i].web_pages
                    });
                }
                scriptContext.response.writePage(form);

            }
        }

        return { onRequest }

    });
