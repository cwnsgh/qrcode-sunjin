import authOptionsDefinition from "@/auth"; // auth.ts의 default export 가져오기
import handler from "@/auth";

// ---  디버깅 로그  ---
console.log("--- [DEBUG] /api/auth/[...nextauth]/route.ts ---");
console.log("타입확인하자:", typeof authOptionsDefinition);
console.log(
  "객체니..??",
  typeof authOptionsDefinition === "object" && authOptionsDefinition !== null
);
if (
  typeof authOptionsDefinition === "object" &&
  authOptionsDefinition !== null
) {
  console.log(
    "키 가지고있니 ??",
    authOptionsDefinition.hasOwnProperty("providers")
  );
  console.log("배열이니 ??", Array.isArray(authOptionsDefinition.providers));
}
console.log("--------------------------------------------------");

export { handler as GET, handler as POST };
