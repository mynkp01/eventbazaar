"use client";
import { FacebookIcon, InstagramIcon } from "@assets/index";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { IconButton, Modal, Tooltip } from "@mui/material";
import { Dispatch, SetStateAction, useState } from "react";
import {
  EmailIcon,
  EmailShareButton,
  FacebookShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from "react-share";
import { copyToClipboard, showToast } from "src/utils/helper";

interface ShareData {
  url: string;
  title: string;
}

const SocialShare: React.FC<ShareData> = ({ url, title }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyToClipboard = async () => {
    try {
      const success = await copyToClipboard(url);
      if (success) {
        setCopied(true);
        showToast("success", "Link copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
      } else {
        throw new Error("Copy failed");
      }
    } catch (error) {
      showToast("error", "Failed to copy link");
      console.error("Copy failed:", error);
    }
  };

  const handleInstagramShare = async () => {
    try {
      const success = await copyToClipboard();
      if (success) {
        showToast("success", "Content copied! Open Instagram to share");
      } else {
        throw new Error("Copy failed");
      }
    } catch (error) {
      showToast("error", "Failed to prepare content for Instagram");
      console.error("Instagram share failed:", error);
    }
  };

  const shareButtons = [
    {
      name: "Copy To Clipboard",
      icon: <ContentCopyIcon />,
      onClick: handleCopyToClipboard,
      tooltip: copied ? "Copied!" : "Copy to clipboard",
    },
    {
      name: "Facebook",
      component: FacebookShareButton,
      icon: <FacebookIcon className="size-8" />,
      props: { url, quote: title },
    },
    {
      name: "Twitter",
      component: TwitterShareButton,
      icon: <TwitterIcon size={32} round />,
      props: { url, title },
    },
    {
      name: "WhatsApp",
      component: WhatsappShareButton,
      icon: <WhatsappIcon size={32} round />,
      props: { url, title: title },
    },
    {
      name: "Email",
      component: EmailShareButton,
      icon: <EmailIcon size={32} round />,
      props: { url, subject: title },
    },
    {
      name: "Instagram",
      icon: <InstagramIcon className="size-8" />,
      onClick: handleInstagramShare,
      tooltip: "Copy for Instagram",
    },
  ];

  return (
    <div className="flex items-center justify-center">
      <div className="w-full max-w-md rounded-lg bg-white p-6">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {shareButtons.map((button) => (
            <Tooltip
              key={button.name}
              placement="top"
              title={button.tooltip || button.name}
            >
              <div className="flex flex-col items-center justify-center gap-2 text-center text-xs md:text-sm">
                {button.component ? (
                  <button.component
                    {...button.props}
                    className="transform transition-transform hover:scale-110"
                  >
                    {button.icon}
                  </button.component>
                ) : (
                  <IconButton
                    onClick={button.onClick}
                    className="transform rounded-full bg-gray-100 p-2 transition-transform hover:scale-110"
                  >
                    {button.icon}
                  </IconButton>
                )}
                <p>{button.name}</p>
              </div>
            </Tooltip>
          ))}
        </div>
      </div>
    </div>
  );
};

const SocialMediaShareModal = ({
  url,
  visible,
  setVisible,
  vendorData,
}: {
  url?: string;
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
  vendorData?: any;
}) => {
  const shareData = {
    url: url || window.location.href,
    title: vendorData?.company_name || "Find or refer event vendors here",
  };

  return (
    <Modal
      open={visible}
      onClose={() => setVisible(false)}
      aria-labelledby="share-modal"
      className="w flex h-full w-full items-center justify-center"
    >
      <SocialShare {...shareData} />
    </Modal>
  );
};

export default SocialMediaShareModal;
