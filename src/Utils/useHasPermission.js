// import { useContext, useMemo } from "react";
// import { ExpensesContext } from "../Context/ExpensesContext";
// import { PGContext } from "../Context/PGContext";
// import { checkPermission } from "./permissionUtils";

// export const useHasPermission = (moduleName) => {
//   const { rolePermission } = useContext(ExpensesContext);
//   const { PGDetails } = useContext(PGContext);

//   const isValidSubscription = PGDetails?.isSubscriptionActive === true;

//   return useMemo(() => {
//     return {
//       canWriteModule:
//         isValidSubscription &&
//         checkPermission(rolePermission, moduleName, "canWrite"),

//       canReadModule:
//         isValidSubscription &&
//         checkPermission(rolePermission, moduleName, "canRead"),

//       canUpdateModule:
//         isValidSubscription &&
//         checkPermission(rolePermission, moduleName, "canUpdate"),

//       canDeleteModule:
//         isValidSubscription &&
//         checkPermission(rolePermission, moduleName, "canDelete"),
//     };
//   }, [rolePermission, isValidSubscription, moduleName]);
// };

// src/Hooks/useHasPermission.js
import { useContext, useMemo } from "react";
import { ExpensesContext } from "../Context/ExpensesContext";
import { PGContext } from "../Context/PGContext";
import { checkPermission } from "./permissionUtils";

export const useHasPermission = (moduleName) => {
  const { rolePermission } = useContext(ExpensesContext);
  const { PGDetails } = useContext(PGContext);

  const isValidSubscription = PGDetails?.isSubscriptionActive === true;

  return useMemo(() => {
    return {
      canWriteModule:
        isValidSubscription &&
        checkPermission(rolePermission, moduleName, "canWrite"),

      canReadModule:
        checkPermission(rolePermission, moduleName, "canRead"),

      canUpdateModule:
        isValidSubscription &&
        checkPermission(rolePermission, moduleName, "canUpdate"),

      canDeleteModule:
        isValidSubscription &&
        checkPermission(rolePermission, moduleName, "canDelete"),
    };
  }, [rolePermission, isValidSubscription, moduleName]);
};