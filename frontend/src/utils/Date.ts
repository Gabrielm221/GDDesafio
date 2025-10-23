export const getCurrentDate = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = today.getMonth() + 1;
    const dd = today.getDate();

    const finalDd =  (dd < 10) ? '0' + dd : dd;
    const finalMm =  (mm < 10) ? '0' + mm : mm;

    return finalDd + '/' + finalMm + '/' + yyyy;
}