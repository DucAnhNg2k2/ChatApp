const convertTimestampToDate = (timestamp: number): string => {
  const date = new Date(timestamp * 1000);
  return (
    date.getDate() + "/" + date.getUTCMonth() + "/" + date.getUTCFullYear()
  );
};

export { convertTimestampToDate };
