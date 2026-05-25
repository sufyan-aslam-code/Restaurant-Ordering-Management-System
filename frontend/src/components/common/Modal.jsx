import { X } from "lucide-react";

const Modal = ({
    isOpen,
    onClose,
    title,
    children,
    maxWidth = "max-w-2xl",
}) => {

    if (!isOpen) return null;

    return (

        <div
            className="
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        bg-black/50
        backdrop-blur-sm
        p-4
      "
            onClick={onClose}
        >

            {/* MODAL BOX */}
            <div
                onClick={(event) =>
                    event.stopPropagation()
                }
                className={`
          relative
          w-full
          ${maxWidth}
          rounded-3xl
          overflow-hidden
          bg-white
          shadow-2xl
          animate-in
          fade-in
          zoom-in-95
          duration-200
        `}
            >

                {/* HEADER */}
                <div
                    className="
            flex
            items-center
            justify-between
            border-b
            border-gray-100
            bg-white
            px-6
            py-5
          "
                >

                    <h2
                        className="
              text-2xl
              font-bold
              text-gray-900
            "
                    >
                        {title}
                    </h2>

                    <button
                        onClick={onClose}
                        className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-full
              text-gray-500
              transition
              hover:bg-gray-100
              hover:text-gray-900
            "
                    >

                        <X size={20} />

                    </button>

                </div>


                {/* BODY */}
                <div
                    className="
    max-h-[75vh]
    overflow-y-auto
    scrollbar-none
    p-6
  "
                >

                    {children}

                </div>

            </div>

        </div>

    );

};

export default Modal;