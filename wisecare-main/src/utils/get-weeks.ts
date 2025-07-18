//Calculate weeks function
export function calcWeeks(start: Date | undefined, end: Date | undefined): number | undefined{
const msInDay = 1000 * 60 * 60 * 24;
if (start!= undefined && end!= undefined) {
    const diff = Math.abs(end.getTime() - start.getTime());
    const final = Math.ceil(diff / msInDay / 7);
    if (final > 31){
        return undefined;
    } else {
        return final;
    }
} else {
    return undefined;
}
};

