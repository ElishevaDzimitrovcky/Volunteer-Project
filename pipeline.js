export default function addPipeLine() {
db.getCollection('HelpRequest').aggregate(
    // const pipeline =
    [
      { $match: { Status: 'waiting' } },
      {
        $lookup: {
          from: 'Status',
          localField: 'Status',
          foreignField: 'Status',
          as: 'currentStatus'
        }
      },
      {
        $lookup: {
          from: 'Location',
          localField: 'Location',
          foreignField: 'LocationCode',
          as: 'currentLocation'
        }
      },
      {
        $lookup: {
          from: 'priority',
          localField: 'PriorityCode',
          foreignField: 'PriorityCode',
          as: 'Priority'
        }
      },
      { $unwind: { path: '$currentStatus' } },
      { $unwind: { path: '$currentLocation' } },
      { $unwind: { path: '$Priority' } },
      {
        $addFields: {
          Status: '$currentStatus.Status',
          PriorityLevel: '$Priority.PriorityName',
          Location: '$currentLocation.CityName'
        }
      },
      {
        $project: {
          currentStatus: 0,
          Priority: 0,
          PriorityCode: 0,
          currentLocation: 0
        }
      }
    ],
    { maxTimeMS: 60000, allowDiskUse: true });
}