module.exports = {
  formatTime: (string) => {
    // console.log(string);
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'July',
      'Aug',
      'Sept',
      'Oct',
      'Nov',
      'Dec',
    ];
    let date = new Date(string);

    // Format HH:MM AM/PM 17th Nov 2020
    let hh = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
    let mm =
      date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
    let day = date.getDate();
    let month = months[date.getMonth()];

    return `${hh}:${mm} ${day} ${month}`;
  },
};
