

//GET Visit list by UserId
router.get('/getVisitsById', (_req: Request, res: Response) => {
    const authPayload = getUserPayloadfromAuthToken(_req)
    const userId = authPayload.employeeID
    const dealerId = _req.query.dealerId
    async.waterfall([(cb) => {
        ServiceLogic.getVisitList(dealerId, userId, false).then((visits)=>{
        cb(null, visits)
      }).catch((err) => cb(err, null));
    }, (visits, cb) => {
  async.mapSeries(visits, (visit, callback) =>{
    const whereCondition = { visitId : visit._id , isDeleted : false}
      ServiceLogic.getactionItemsById(whereCondition, {updatedAt : -1}).then((actionItems) => {
      visit.actionItem = actionItems
      callback(null, visit)
    }).catch((err)=> callback(err, null))
  }, (err, visits)=> {
      cb(null, visits)
    });
  }], (err, result) =>{
    if(err)
     return errorHandling(res,err)
    res.status(200);
    res.json(result);
    })
  })
