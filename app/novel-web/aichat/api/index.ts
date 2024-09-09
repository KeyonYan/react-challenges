import http from "../util/http"

const novel = "/novels"


export const getNovel = async (params: {
    number?: number,
}): Promise<any> => {
    return await http.get(`${novel}/${params.number}`);
};