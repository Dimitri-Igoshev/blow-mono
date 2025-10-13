import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateMessageMutation } from "@/redux/services/messageApi";
import { useUpdateClaimMutation } from "@/redux/services/claimApi";
import { useUpdateUserMutation } from "@/redux/services/userApi";
import { useDisclosure } from "@heroui/react";
import { onlyDigits } from "@/helper/onlyDigets";
import { useUpdateServiceMutation } from "@/redux/services/serviceApi";
import {
  useCreateCityMutation,
  useUpdateCityMutation,
} from "@/redux/services/cityApi";
import { transliterate } from "@/helper/transliterate";
import { useDeleteMailingMutation } from "@/redux/services/mailingApi";
import { useUpdateWithdrawalMutation } from "@/redux/services/withdrawalApi";
import { useUpdateTransactionMutation } from "@/redux/services/transactionApi"

const ADMIN = "687e288380f443b2e015a85d";

export const useEntityActions = () => {
  const navigate = useNavigate();
  const [currentItem, setCurrentItem] = useState<any>();

  const {
    isOpen: isReply,
    onOpen: onReply,
    onOpenChange: changeReply,
  } = useDisclosure();
  const {
    isOpen: isMoney,
    onOpen: onMoney,
    onOpenChange: changeMoney,
  } = useDisclosure();
  const {
    isOpen: isPricing,
    onOpen: onPricing,
    onOpenChange: changePricing,
  } = useDisclosure();
  const {
    isOpen: isCity,
    onOpen: onCity,
    onOpenChange: changeCity,
  } = useDisclosure();

  const [reply] = useCreateMessageMutation();
  const [claim] = useUpdateClaimMutation();
  const [update] = useUpdateUserMutation();
  const [updateService] = useUpdateServiceMutation();
  const [city] = useCreateCityMutation();
  const [orderCity] = useUpdateCityMutation();
  const [removeMailing] = useDeleteMailingMutation();
  const [updateWithdrawal] = useUpdateWithdrawalMutation();
  const [updateTransaction] = useUpdateTransactionMutation()

  const onAction = async (action: string, value: any) => {
    try {
      switch (action) {
        case "topUpMoney":
          await updateWithdrawal({
            id: value._id,
            body: { status: 'paid_out' },
          }).unwrap();
          await updateTransaction({
            id: value.transactionId,
            body: { status: 'completed' },
          }).unwrap();
          break;
        case "removeMailing":
          await removeMailing(value).unwrap();
          break;
        case "changeActivity":
          await update({
            id: value._id,
            body: { status: value.status === "active" ? "inactive" : "active" },
          }).unwrap();
          break;
        case "toArchive":
          await update({
            id: value._id,
            body: { status: "archive" },
          }).unwrap();
          break;
        case "toSession":
          navigate(`/sessions?userId=${value._id}`);
          break;
        case "toEdit":
          window.open(
            `/users/edit/${value._id}`,
            "_blank",
            "noopener,noreferrer"
          );
          break;
        case "addMoney":
          if (!isMoney) {
            onMoney();
            setCurrentItem(value);
          } else if (currentItem) {
            await update({
              id: currentItem._id,
              body: {
                balance: currentItem.balance
                  ? Number(currentItem.balance) + Number(onlyDigits(value))
                  : Number(onlyDigits(value)),
              },
            }).unwrap();
          }
          break;
        case "pricing":
          if (!isPricing) {
            setCurrentItem(value);
            onPricing();
          } else {
            await updateService({
              id: currentItem._id,
              body: { options: value },
            }).unwrap();
            changePricing();
            window.location.reload();
          }
          break;
        case "toMessages":
          navigate(`/messages?userId=${value._id}`);
          break;

        case "toProfile":
          window.open(
            `https://kutumba.ru/account/search/${value._id}`,
            "_blank",
            "noopener,noreferrer"
          );
          break;

        case "reply":
          if (!isReply) {
            setCurrentItem(value);
            onReply();
          } else if (currentItem) {
            await reply({
              sender: ADMIN,
              recipient: currentItem?.from?._id,
              text: value,
            }).unwrap();

            await claim({
              id: currentItem._id,
              body: { reply: value },
            }).unwrap();

            changeReply();
          }
          break;
        case "addCity":
          if (!isCity) {
            onCity();
            setCurrentItem(value);
          } else if (currentItem) {
            await city({
              label: value,
              value: transliterate(value),
              order: 100,
            }).unwrap();
          }

          changeCity();
          break;
        case "up":
          await orderCity({
            id: value._id,
            body: { order: value.order - 1 },
          }).unwrap();
          break;
        case "down":
          await orderCity({
            id: value._id,
            body: { order: value.order + 1 },
          }).unwrap();
          break;
        case "fake":
          await update({
            id: value._id,
            body: {
              isFake: value?.isFake ? false : true,
            },
          })
            .unwrap()
            .then((res) => console.log(res))
            .catch((err) => console.log(err));
          break;
        default:
          console.log("Неизвестное действие");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return {
    onAction,
    currentItem,
    isReply,
    isMoney,
    isPricing,
    isCity,
    onReply,
    onMoney,
    onPricing,
    onCity,
    changeReply,
    changeMoney,
    changePricing,
    changeCity,
  };
};
