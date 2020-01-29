import { useState, useEffect } from 'react';

export default axios => {
    const [error, setError] = useState(null);
        // state = {
        //     error: null
        // }

        const reqInterceptor = axios.interceptors.request.use( req => {
            setError(null);
            return req;
        } );
        const resInterceptor = axios.interceptors.response.use( res => res, error => {
            setError(error);
        } );

        // UNSAFE_componentWillMount () {
        //     this.reqInterceptor = axios.interceptors.request.use( req => {
        //         this.setState( { error: null } );
        //         return req;
        //     } );
        //     this.resInterceptor = axios.interceptors.response.use( res => res, error => {
        //         this.setState( { error: error } );
        //     } );
        // }

        useEffect(() => {
            return () => {
                axios.interceptors.request.eject( reqInterceptor );
                axios.interceptors.response.eject( resInterceptor );
            }
        }, [reqInterceptor, resInterceptor, axios.interceptors.request, axios.interceptors.response])

        const errorConfirmedHandler = () => {
            setError(null);
        }

        return [error, errorConfirmedHandler];
}