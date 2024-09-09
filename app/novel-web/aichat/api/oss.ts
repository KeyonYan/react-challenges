import COS from "cos-js-sdk-v5";
const cos = new COS({
  SecretId: "",
  SecretKey: "",
});

const dataURLtoBlob = function (dataurl: string): Blob {
  const arr = dataurl.split(",");
  if (arr == null || arr[0] == null) {
    throw new Error("dataurl format error");
  }
  const regRes = arr[0].match(/:(.*?);/);
  if (regRes == null) {
    throw new Error("dataurl format error");
  }
  const mime = regRes[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
};

export const uploadBase64Img = async (base64Img: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    // 需要转为Blob上传
    const body = dataURLtoBlob(base64Img);
    cos.putObject(
      {
        Bucket: "mqa-photo-1256901694", // 填入您自己的存储桶，必须字段
        Region: "ap-shanghai", // 存储桶所在地域，例如ap-beijing，必须字段
        Key: `${new Date().getTime()}.jpg`, // 存储在桶里的对象键（例如1.jpg，a/b/test.txt），必须字段
        Body: body,
      },
      function (err, data) {
        if (err) {
          console.log("上传失败", err);
          reject({ code: "-1", message: "上传失败" });
        } else {
          console.log("上传成功", data);
          resolve({ code: "0", data: `http://${data.Location}` });
        }
      }
    );
  });
};

export default uploadBase64Img;
