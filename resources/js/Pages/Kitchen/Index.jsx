import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {Head, router} from '@inertiajs/react';
import {useEffect} from "react";
import {toast} from "react-toastify";

export default function Kitchen({ orders, filters }) {

    useEffect(() => {
        const channel = window.Echo.channel("OrderChannel")
            .listen(".Create", (event) => {
                console.log("Event received:", event);

                const order = event.order;
                const message = event.message;

                toast.info(`${message}: ${order.order_no}`);
            });

        return () => {
            window.Echo.leave("OrderChannel");
        };
    }, []);

    const sendOrder = (orderId) => {
        router.post(route('orders.send', { order: orderId }), {}, {
            onSuccess: () => {
                // Optional: Show success message or refresh data
                router.reload();
            },
            onError: (errors) => {
                // Optional: Show error message
                console.error('Error sending order:', errors);
            }
        });
    };



    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Kitchen
                </h2>
            }
        >
            <Head title="Kitchen" />


        </AuthenticatedLayout>
    );
}
