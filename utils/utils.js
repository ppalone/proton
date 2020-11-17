module.exports = {
  formatTime: (string) => {
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
    let hh = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
    let mm =
      date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
    let day = date.getDate();
    let month = months[date.getMonth()];

    return `${hh}:${mm} ${day} ${month}`;
  },
};
